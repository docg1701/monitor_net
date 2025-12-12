import { Injectable, inject } from '@angular/core';
import { DatabaseService } from './database.service';

/**
 * Interface for database migrations.
 * Each migration has a version number and an up() method to apply the migration.
 */
export interface Migration {
  version: number;
  up(): Promise<void>;
}

/**
 * Service responsible for managing database schema migrations.
 * Tracks schema version in settings table and applies pending migrations on startup.
 */
@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  private db = inject(DatabaseService);
  private migrations: Migration[] = [];

  /**
   * Register a migration to be run.
   * Migrations should be registered in order by version number.
   */
  registerMigration(migration: Migration): void {
    this.migrations.push(migration);
    this.migrations.sort((a, b) => a.version - b.version);
  }

  /**
   * Get the current schema version from the settings table.
   * Returns 0 if settings table doesn't exist or schema_version is not set.
   */
  async getCurrentVersion(): Promise<number> {
    try {
      const result = await this.db.select<{ value: string }>(
        "SELECT value FROM settings WHERE key = 'schema_version'"
      );

      if (!result || result.length === 0) {
        return 0;
      }

      const version = parseInt(result[0].value, 10);
      return isNaN(version) ? 0 : version;
    } catch (error) {
      // If table doesn't exist ("no such table" error), return 0 - this is expected on first run
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.toLowerCase().includes('no such table')) {
        console.log('MigrationService: Settings table does not exist yet (first run)');
        return 0;
      }
      // Log other errors but still return 0 to allow migrations to run
      console.error('MigrationService: Error getting current version:', error);
      return 0;
    }
  }

  /**
   * Set the schema version in the settings table.
   * Uses INSERT OR REPLACE to handle both insert and update cases.
   */
  async setVersion(version: number): Promise<void> {
    await this.db.execute(
      "INSERT OR REPLACE INTO settings (key, value) VALUES ('schema_version', ?)",
      [version.toString()]
    );
  }

  /**
   * Run all pending migrations in order.
   * Migrations are applied sequentially, and each successful migration updates the schema version.
   * Errors are logged but do not crash the app.
   */
  async runMigrations(): Promise<void> {
    if (!this.db.isInitialized) {
      console.warn('MigrationService: Database not initialized, skipping migrations');
      return;
    }

    try {
      const currentVersion = await this.getCurrentVersion();
      const pendingMigrations = this.migrations.filter(m => m.version > currentVersion);

      if (pendingMigrations.length === 0) {
        console.log(`MigrationService: Schema is up to date (version ${currentVersion})`);
        return;
      }

      console.log(`MigrationService: Running ${pendingMigrations.length} migration(s) from version ${currentVersion}`);

      for (const migration of pendingMigrations) {
        try {
          console.log(`MigrationService: Applying migration v${migration.version}`);
          await migration.up();
          await this.setVersion(migration.version);
          console.log(`MigrationService: Migration v${migration.version} applied successfully`);
        } catch (error) {
          console.error(`MigrationService: Migration v${migration.version} failed:`, error);
          // Stop processing further migrations on failure, but don't crash the app
          return;
        }
      }

      console.log(`MigrationService: All migrations completed. Schema version: ${pendingMigrations[pendingMigrations.length - 1].version}`);
    } catch (error) {
      console.error('MigrationService: Error running migrations:', error);
      // Don't crash the app - graceful degradation
    }
  }
}
