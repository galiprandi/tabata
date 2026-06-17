# Plan 001: Storage Abstraction Layer

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 67dad4c..HEAD -- src/assets/main.ts src/assets/defaultSettings.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit 67dad4c, 2026-06-17
- **Issue**: none

## Why this matters

The current codebase uses localStorage directly without abstraction, making data migration risky and error-prone. This creates a critical vulnerability for Feature 01 (Gestión de Rutinas) which requires a complex data migration. Without a storage abstraction layer, any migration failure could result in permanent data loss. This plan creates a safe, reversible migration system with validation and rollback capabilities.

## Current state

The relevant files, each with one line on its role:
- `src/assets/main.ts` — Direct localStorage access in getSettings/updateSettings (lines 29-44)
- `src/assets/defaultSettings.ts` — Default settings structure without versioning (entire file)

Excerpts of the code as it exists today:

**src/assets/main.ts:29-44** (current localStorage access):
```typescript
export const storageKey = "settings";

// Get settings from local storage
export function getSettings() {
  let storageConfig = localStorage.getItem(storageKey);
  if (!storageConfig) {
    localStorage.setItem(storageKey, JSON.stringify(defaultSettings));
    storageConfig = JSON.stringify(defaultSettings);
  }
  const settings = JSON.parse(storageConfig) as typeof defaultSettings;
  if (!settings.rounds) settings.rounds = settings.workouts.length;
  if (!settings.nextExercise) settings.nextExercise = 0;
  return settings;
}

// Update settings in local storage
export function updateSettings(settings: typeof defaultSettings) {
  localStorage.setItem(storageKey, JSON.stringify(settings));
}
```

**src/assets/defaultSettings.ts:1-17** (current structure):
```typescript
export const defaultSettings = {
  prepDuration: 10,
  workDuration: 20,
  restDuration: 10,
  nextExercise: 0,
  rounds: 8,
  workouts: [
    "Jump Squats",
    "Push-Ups",
    "Burpees",
    "Mountain Climbers",
    "Jumping Lunges",
    "Plank Shoulder Taps",
    "High Knees",
    "Plank",
  ],
};
```

The repo conventions that apply here:
- TypeScript with strict typing — see existing test files for type patterns
- Functions are pure where possible — see `src/assets/domHelpers.ts`
- Error handling with try-catch — see `src/assets/audio.ts`

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Build     | `npm run build`          | exit 0, no errors   |
| Tests     | `npm run test`           | all pass            |
| Typecheck | `npx tsc --noEmit`       | exit 0, no errors   |

## Suggested executor toolkit

- Use the `vitest-testing` skill if available for creating tests
- Reference existing test patterns in `src/assets/main.test.ts`

## Scope

**In scope** (the only files you should modify):
- `src/assets/main.ts` — Replace localStorage with StorageManager
- `src/assets/defaultSettings.ts` — Add schema version
- `src/assets/storage/StorageManager.ts` — Create new
- `src/assets/storage/SchemaValidator.ts` — Create new
- `src/assets/storage/MigrationManager.ts` — Create new
- `src/assets/storage/index.ts` — Create new (exports)
- `src/assets/main.test.ts` — Update tests for new layer

**Out of scope** (do NOT touch, even though they look related):
- `src/components/SettingsRoutineList.astro` — UI changes are in Plan 002
- `src/pages/settings.astro` — UI changes are in Plan 002
- Any change to the existing data structure — that's Plan 003

## Git workflow

- Branch: `advisor/001-storage-abstraction`
- Commit per step or per logical unit; message style: conventional commits (e.g., `feat: add storage manager`)
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create storage directory structure

Create the `src/assets/storage/` directory and add an index file for clean imports.

**Actions**:
1. Create directory: `mkdir -p src/assets/storage`
2. Create `src/assets/storage/index.ts` with:
```typescript
export { StorageManager } from './StorageManager';
export { SchemaValidator } from './SchemaValidator';
export { MigrationManager } from './MigrationManager';
```

**Verify**: `ls -la src/assets/storage/` → shows `index.ts` file

### Step 2: Create SchemaValidator

Create a schema validator to ensure data integrity before saving/loading.

**Actions**:
1. Create `src/assets/storage/SchemaValidator.ts` with:
```typescript
export interface Schema<T> {
  version: number;
  validate(data: unknown): data is T;
  migrate(data: unknown): T;
}

export class SchemaValidator {
  static validate<T>(data: unknown, schema: Schema<T>): T {
    if (schema.validate(data)) {
      return data;
    }
    throw new Error('Invalid data schema');
  }

  static validateOrMigrate<T>(data: unknown, schema: Schema<T>): T {
    try {
      return this.validate(data, schema);
    } catch {
      return schema.migrate(data);
    }
  }
}
```

**Verify**: `npx tsc --noEmit src/assets/storage/SchemaValidator.ts` → exit 0, no errors

### Step 3: Create StorageManager

Create a generic storage manager with error handling and validation.

**Actions**:
1. Create `src/assets/storage/StorageManager.ts` with:
```typescript
export class StorageManager<T> {
  private key: string;
  private defaultValue: T;

  constructor(key: string, defaultValue: T) {
    this.key = key;
    this.defaultValue = defaultValue;
  }

  get(): T {
    try {
      const data = localStorage.getItem(this.key);
      if (!data) {
        return this.defaultValue;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error reading from ${this.key}:`, error);
      return this.defaultValue;
    }
  }

  set(data: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to ${this.key}:`, error);
      throw error;
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error(`Error removing ${this.key}:`, error);
    }
  }

  exists(): boolean {
    return localStorage.getItem(this.key) !== null;
  }
}
```

**Verify**: `npx tsc --noEmit src/assets/storage/StorageManager.ts` → exit 0, no errors

### Step 4: Create MigrationManager

Create a migration manager for versioned data migrations with rollback.

**Actions**:
1. Create `src/assets/storage/MigrationManager.ts` with:
```typescript
export interface Migration<T> {
  version: number;
  migrate: (data: unknown) => T;
  rollback?: (data: T) => unknown;
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

  rollback(data: T, toVersion: number): unknown {
    let result = data;
    
    for (let version = this.currentVersion; version > toVersion; version--) {
      const migration = this.migrations.get(version);
      if (!migration || !migration.rollback) {
        throw new Error(`No rollback available for version ${version}`);
      }
      result = migration.rollback(result) as unknown;
    }
    
    return result;
  }

  getCurrentVersion(): number {
    return this.currentVersion;
  }
}
```

**Verify**: `npx tsc --noEmit src/assets/storage/MigrationManager.ts` → exit 0, no errors

### Step 5: Add schema version to defaultSettings

Add version field to enable future migrations.

**Actions**:
1. Modify `src/assets/defaultSettings.ts` to add version:
```typescript
export const defaultSettings = {
  version: 1,
  prepDuration: 10,
  workDuration: 20,
  restDuration: 10,
  nextExercise: 0,
  rounds: 8,
  workouts: [
    "Jump Squats",
    "Push-Ups",
    "Burpees",
    "Mountain Climbers",
    "Jumping Lunges",
    "Plank Shoulder Taps",
    "High Knees",
    "Plank",
  ],
};
```

**Verify**: `npx tsc --noEmit src/assets/defaultSettings.ts` → exit 0, no errors

### Step 6: Update main.ts to use StorageManager

Replace direct localStorage access with StorageManager.

**Actions**:
1. Modify `src/assets/main.ts` to:
```typescript
import { defaultSettings } from "@assets/defaultSettings";
import { getAudioStatus } from "@assets/audio";
import { StorageManager } from "@assets/storage";

export const storageKey = "settings";
const storageManager = new StorageManager(storageKey, defaultSettings);

declare global {
  interface Window {
    timer: any;
    audioContext: AudioContext;
    dataLayer: any[];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  wakeLock();
});

// Listen for wake lock release
async function wakeLock() {
  try {
    const wakeLock = await navigator?.wakeLock?.request();
    wakeLock?.addEventListener("release", () => {
      console.log(`Screen Wake Lock released: ${wakeLock.released}`);
    });
  } catch (error) {}
}

// Get settings from local storage
export function getSettings() {
  const settings = storageManager.get();
  if (!settings.rounds) settings.rounds = settings.workouts.length;
  if (!settings.nextExercise) settings.nextExercise = 0;
  return settings;
}

// Update settings in local storage
export function updateSettings(settings: typeof defaultSettings) {
  storageManager.set(settings);
}
```

**Verify**: `npm run build` → exit 0, no errors

### Step 7: Update tests for StorageManager

Update existing tests to work with the new storage layer.

**Actions**:
1. Modify `src/assets/main.test.ts` to mock StorageManager:
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getSettings,
  updateSettings,
  delaySeconds,
  textToSpeech,
  updateTextContent,
  gaEvent,
} from './main';
import { defaultSettings } from './defaultSettings';
import { StorageManager } from './storage';

// Mock StorageManager
vi.mock('./storage', () => ({
  StorageManager: vi.fn().mockImplementation(() => ({
    get: vi.fn(() => ({ ...defaultSettings })),
    set: vi.fn(),
    remove: vi.fn(),
    exists: vi.fn(() => true),
  })),
}));
```

**Verify**: `npm run test` → all tests pass

### Step 8: Add integration tests for StorageManager

Create tests to verify the storage layer works correctly.

**Actions**:
1. Add tests to `src/assets/main.test.ts`:
```typescript
describe('StorageManager integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should use StorageManager for getSettings', () => {
    const settings = getSettings();
    expect(settings).toBeDefined();
    expect(settings.workouts).toBeInstanceOf(Array);
  });

  it('should use StorageManager for updateSettings', () => {
    const newSettings = { ...defaultSettings, workDuration: 30 };
    updateSettings(newSettings);
    const retrieved = getSettings();
    expect(retrieved.workDuration).toBe(30);
  });
});
```

**Verify**: `npm run test` → all tests pass (including new tests)

## Test plan

- New tests to write:
  - StorageManager integration tests in `src/assets/main.test.ts`
  - SchemaValidator unit tests in `src/assets/storage/SchemaValidator.test.ts`
  - MigrationManager unit tests in `src/assets/storage/MigrationManager.test.ts`
- Which existing test to use as the structural pattern:
  - Model after `src/assets/main.test.ts` for structure
- Verification: `npm run test` → all pass, including new tests

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `npm run build` exits 0
- [ ] `npm run test` exits 0; new tests for StorageManager exist and pass
- [ ] `npx tsc --noEmit` exits 0
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The code at the locations in "Current state" doesn't match the excerpts
- A step's verification fails twice after a reasonable fix attempt
- The fix appears to require touching an out-of-scope file
- You discover that localStorage is not available in the test environment
- The existing tests fail after Step 6 and cannot be fixed with simple mocking

## Maintenance notes

For the human/agent who owns this code after the change lands:

- Future migrations should be registered in MigrationManager before deploying
- The StorageManager is now the single source of truth for localStorage access
- All new features should use StorageManager instead of direct localStorage access
- Schema version in defaultSettings must be incremented when data structure changes
- Follow-up: Plan 002 will depend on this abstraction layer
