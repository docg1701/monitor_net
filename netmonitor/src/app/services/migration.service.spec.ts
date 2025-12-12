import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MigrationService, Migration } from './migration.service';
import { DatabaseService } from './database.service';
import { createV1Migration } from './migrations/v1-initial-schema';

describe('MigrationService', () => {
  let service: MigrationService;
  let mockDb: {
    isInitialized: boolean;
    isInitialized$: BehaviorSubject<boolean>;
    execute: ReturnType<typeof vi.fn>;
    select: ReturnType<typeof vi.fn>;
    init: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockDb = {
      isInitialized: true,
      isInitialized$: new BehaviorSubject<boolean>(true),
      execute: vi.fn().mockResolvedValue(undefined),
      select: vi.fn().mockResolvedValue([]),
      init: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined)
    };

    TestBed.configureTestingModule({
      providers: [
        MigrationService,
        { provide: DatabaseService, useValue: mockDb }
      ]
    });
    service = TestBed.inject(MigrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentVersion', () => {
    it('should return 0 when settings table is empty', async () => {
      mockDb.select.mockResolvedValue([]);

      const version = await service.getCurrentVersion();

      expect(version).toBe(0);
      expect(mockDb.select).toHaveBeenCalledWith(
        "SELECT value FROM settings WHERE key = 'schema_version'"
      );
    });

    it('should return 0 when settings table does not exist', async () => {
      mockDb.select.mockRejectedValue(new Error('no such table: settings'));

      const version = await service.getCurrentVersion();

      expect(version).toBe(0);
    });

    it('should return stored version when present', async () => {
      mockDb.select.mockResolvedValue([{ value: '3' }]);

      const version = await service.getCurrentVersion();

      expect(version).toBe(3);
    });

    it('should return 0 when version value is not a number', async () => {
      mockDb.select.mockResolvedValue([{ value: 'invalid' }]);

      const version = await service.getCurrentVersion();

      expect(version).toBe(0);
    });
  });

  describe('setVersion', () => {
    it('should correctly store version in settings table', async () => {
      await service.setVersion(5);

      expect(mockDb.execute).toHaveBeenCalledWith(
        "INSERT OR REPLACE INTO settings (key, value) VALUES ('schema_version', ?)",
        ['5']
      );
    });
  });

  describe('runMigrations', () => {
    it('should skip migrations when database is not initialized', async () => {
      mockDb.isInitialized = false;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await service.runMigrations();

      expect(mockDb.select).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'MigrationService: Database not initialized, skipping migrations'
      );
      consoleSpy.mockRestore();
    });

    it('should execute migrations in order', async () => {
      const executionOrder: number[] = [];

      const migration1: Migration = {
        version: 1,
        up: vi.fn().mockImplementation(async () => {
          executionOrder.push(1);
        })
      };

      const migration2: Migration = {
        version: 2,
        up: vi.fn().mockImplementation(async () => {
          executionOrder.push(2);
        })
      };

      // Register in reverse order to test sorting
      service.registerMigration(migration2);
      service.registerMigration(migration1);

      mockDb.select.mockResolvedValue([]);

      await service.runMigrations();

      expect(executionOrder).toEqual([1, 2]);
      expect(migration1.up).toHaveBeenCalled();
      expect(migration2.up).toHaveBeenCalled();
    });

    it('should skip already-applied migrations', async () => {
      const migration1: Migration = {
        version: 1,
        up: vi.fn().mockResolvedValue(undefined)
      };

      const migration2: Migration = {
        version: 2,
        up: vi.fn().mockResolvedValue(undefined)
      };

      service.registerMigration(migration1);
      service.registerMigration(migration2);

      // Current version is 1, so only migration 2 should run
      mockDb.select.mockResolvedValue([{ value: '1' }]);

      await service.runMigrations();

      expect(migration1.up).not.toHaveBeenCalled();
      expect(migration2.up).toHaveBeenCalled();
    });

    it('should log error but not throw when migration fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const failingMigration: Migration = {
        version: 1,
        up: vi.fn().mockRejectedValue(new Error('Migration failed'))
      };

      service.registerMigration(failingMigration);
      mockDb.select.mockResolvedValue([]);

      // Should not throw
      await expect(service.runMigrations()).resolves.not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        'MigrationService: Migration v1 failed:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it('should stop processing further migrations after a failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const migration1: Migration = {
        version: 1,
        up: vi.fn().mockRejectedValue(new Error('Migration failed'))
      };

      const migration2: Migration = {
        version: 2,
        up: vi.fn().mockResolvedValue(undefined)
      };

      service.registerMigration(migration1);
      service.registerMigration(migration2);
      mockDb.select.mockResolvedValue([]);

      await service.runMigrations();

      expect(migration1.up).toHaveBeenCalled();
      expect(migration2.up).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should update version after each successful migration', async () => {
      const migration1: Migration = {
        version: 1,
        up: vi.fn().mockResolvedValue(undefined)
      };

      const migration2: Migration = {
        version: 2,
        up: vi.fn().mockResolvedValue(undefined)
      };

      service.registerMigration(migration1);
      service.registerMigration(migration2);
      mockDb.select.mockResolvedValue([]);

      await service.runMigrations();

      // setVersion should be called twice (once for each migration)
      expect(mockDb.execute).toHaveBeenCalledWith(
        "INSERT OR REPLACE INTO settings (key, value) VALUES ('schema_version', ?)",
        ['1']
      );
      expect(mockDb.execute).toHaveBeenCalledWith(
        "INSERT OR REPLACE INTO settings (key, value) VALUES ('schema_version', ?)",
        ['2']
      );
    });
  });

  describe('V1 Migration', () => {
    let v1Migration: Migration;

    beforeEach(() => {
      v1Migration = createV1Migration(mockDb as unknown as DatabaseService);
    });

    it('should have version 1', () => {
      expect(v1Migration.version).toBe(1);
    });

    it('should create settings table with correct columns', async () => {
      await v1Migration.up();

      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS settings')
      );
      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('key TEXT PRIMARY KEY')
      );
      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('value TEXT')
      );
    });

    it('should create pings table with correct columns', async () => {
      await v1Migration.up();

      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS pings')
      );
      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('id INTEGER PRIMARY KEY AUTOINCREMENT')
      );
      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('timestamp INTEGER NOT NULL')
      );
      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('latency_ms REAL')
      );
      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('success INTEGER NOT NULL')
      );
      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('target TEXT NOT NULL')
      );
    });

    it('should create index on pings.timestamp', async () => {
      await v1Migration.up();

      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_pings_timestamp ON pings(timestamp)')
      );
    });

    it('should create settings table before pings table', async () => {
      const executionOrder: string[] = [];
      mockDb.execute.mockImplementation(async (sql: string) => {
        if (sql.includes('CREATE TABLE IF NOT EXISTS settings')) {
          executionOrder.push('settings');
        } else if (sql.includes('CREATE TABLE IF NOT EXISTS pings')) {
          executionOrder.push('pings');
        }
      });

      await v1Migration.up();

      expect(executionOrder[0]).toBe('settings');
      expect(executionOrder[1]).toBe('pings');
    });
  });
});
