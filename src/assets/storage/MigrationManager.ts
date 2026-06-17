export interface Migration<T> {
  version: number;
  migrate: (data: unknown) => T;
  rollback?: (data: T) => T;
}

export class MigrationManager<T> {
  private migrations: Map<number, Migration<T>> = new Map();
  private currentVersion: number = 0;

  registerMigration(migration: Migration<T>): void {
    this.migrations.set(migration.version, migration);
    this.currentVersion = Math.max(this.currentVersion, migration.version);
  }

  migrate(data: unknown, fromVersion: number = 0): T {
    let result = data;
    
    for (let version = fromVersion + 1; version <= this.currentVersion; version++) {
      const migration = this.migrations.get(version);
      if (!migration) {
        throw new Error(`No migration found for version ${version}`);
      }
      result = migration.migrate(result);
    }
    
    return result as T;
  }

  rollback(data: T, toVersion: number): T {
    let result: T = data;
    
    for (let version = this.currentVersion; version > toVersion; version--) {
      const migration = this.migrations.get(version);
      if (!migration || !migration.rollback) {
        throw new Error(`No rollback available for version ${version}`);
      }
      result = migration.rollback(result);
    }
    
    return result;
  }

  getCurrentVersion(): number {
    return this.currentVersion;
  }
}
