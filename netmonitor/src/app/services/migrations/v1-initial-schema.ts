import { Migration } from '../migration.service';
import { DatabaseService } from '../database.service';

/**
 * Version 1 Migration: Initial Schema
 * Creates the base tables for NetMonitor:
 * - settings: Key-value store for app configuration (including schema version)
 * - pings: Stores ping measurement results
 */
export function createV1Migration(db: DatabaseService): Migration {
  return {
    version: 1,
    async up(): Promise<void> {
      // Create settings table FIRST (needed to track schema version)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT
        )
      `);

      // Create pings table for storing measurement results
      await db.execute(`
        CREATE TABLE IF NOT EXISTS pings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp INTEGER NOT NULL,
          latency_ms REAL,
          success INTEGER NOT NULL,
          target TEXT NOT NULL
        )
      `);

      // Create index on timestamp for query performance
      await db.execute(`
        CREATE INDEX IF NOT EXISTS idx_pings_timestamp ON pings(timestamp)
      `);
    }
  };
}
