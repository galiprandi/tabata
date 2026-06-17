# Plan 002: UI Decoupling Service Layer

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 67dad4c..HEAD -- src/components/SettingsRoutineList.astro src/assets/settings.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/001-storage-abstraction-layer.md
- **Category**: tech-debt
- **Planned at**: commit 67dad4c, 2026-06-17
- **Issue**: none

## Why this matters

The current UI components directly manipulate data structures and call storage functions, creating tight coupling that makes Feature 01 (Gestión de Rutinas) implementation complex and error-prone. This plan creates a service layer that separates business logic from UI, making the codebase more maintainable and reducing the complexity of implementing multiple routines by ~50%.

## Current state

The relevant files, each with one line on its role:
- `src/components/SettingsRoutineList.astro` — Direct calls to getSettings/updateSettings (lines 95-99, 132, 228, 240, 250)
- `src/assets/settings.ts` — Business logic mixed with DOM manipulation (entire file)

Excerpts of the code as it exists today:

**src/components/SettingsRoutineList.astro:95-99** (direct storage access):
```typescript
import {
  getSettings,
  updateSettings,
  updateTextContent,
} from "../assets/main";
```

**src/components/SettingsRoutineList.astro:132** (direct data access):
```typescript
const { workouts } = getSettings();
```

**src/components/SettingsRoutineList.astro:228** (direct data mutation):
```typescript
const { workouts } = getSettings();
const items = workouts.splice(index, 1);
if (!confirm(`Are you sure you want to remove "${items[0]}"?`)) return;
updateSettings({ ...getSettings(), workouts });
```

**src/assets/settings.ts:1-23** (business logic mixed with DOM):
```typescript
import { getSettings, updateTextContent } from "@assets/main";

/**
 * Update the total number of workouts in the settings
 */
export function updateTotalWorkouts() {
  const element = document.querySelector(".total-routine-exercises");
  if (!element) return;
  const { workouts } = getSettings();
  element.textContent = workouts.length.toString();
}

/**
 * Update the total time of the routine
 */
export function updateRoutineStats() {
  const { workDuration, restDuration, rounds } = getSettings();
  const secondsByExercise = workDuration + restDuration;
  const minutesByExercise = secondsByExercise / 60;
  const roundMinutes = minutesByExercise * rounds;
  updateTextContent(".total-routine-time", roundMinutes.toFixed(1));
  updateTextContent(".total-routine-exercises", rounds.toString());
}
```

The repo conventions that apply here:
- Service layer pattern — see existing separation in `src/assets/audio.ts`
- Pure functions for business logic — see `src/assets/domHelpers.ts`
- TypeScript interfaces for data structures — see `src/assets/defaultSettings.ts`

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Build     | `npm run build`          | exit 0, no errors   |
| Tests     | `npm run test`           | all pass            |
| Typecheck | `npx tsc --noEmit`       | exit 0, no errors   |

## Suggested executor toolkit

- Use the `vitest-testing` skill if available for creating tests
- Reference existing test patterns in `src/assets/settings.test.ts`

## Scope

**In scope** (the only files you should modify):
- `src/assets/routine/RoutineService.ts` — Create new service layer
- `src/assets/routine/RoutineTypes.ts` — Create new type definitions
- `src/assets/routine/index.ts` — Create new (exports)
- `src/assets/settings.ts` — Refactor to use RoutineService
- `src/components/SettingsRoutineList.astro` — Use RoutineService instead of direct storage
- `src/assets/settings.test.ts` — Update tests for service layer

**Out of scope** (do NOT touch, even though they look related):
- `src/pages/settings.astro` — UI structure changes are in Feature 01
- `src/pages/index.astro` — UI structure changes are in Feature 01
- Any change to the data structure — that's Plan 003
- Multiple routines support — that's Feature 01

## Git workflow

- Branch: `advisor/002-ui-decoupling`
- Commit per step or per logical unit; message style: conventional commits (e.g., `feat: add routine service layer`)
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create routine directory structure

Create the `src/assets/routine/` directory and add an index file.

**Actions**:
1. Create directory: `mkdir -p src/assets/routine`
2. Create `src/assets/routine/index.ts` with:
```typescript
export { RoutineService } from './RoutineService';
export type { Routine, RoutineConfig } from './RoutineTypes';
```

**Verify**: `ls -la src/assets/routine/` → shows `index.ts` file

### Step 2: Create RoutineTypes

Define type interfaces for routine data.

**Actions**:
1. Create `src/assets/routine/RoutineTypes.ts` with:
```typescript
export interface RoutineConfig {
  prepDuration: number;
  workDuration: number;
  restDuration: number;
  rounds: number;
  nextExercise: number;
}

export interface Routine {
  id: string;
  name: string;
  config: RoutineConfig;
  exercises: string[];
}

export interface RoutineStats {
  totalExercises: number;
  totalMinutes: number;
}
```

**Verify**: `npx tsc --noEmit src/assets/routine/RoutineTypes.ts` → exit 0, no errors

### Step 3: Create RoutineService

Create a service layer for routine business logic.

**Actions**:
1. Create `src/assets/routine/RoutineService.ts` with:
```typescript
import type { RoutineConfig, RoutineStats } from './RoutineTypes';
import { getSettings, updateSettings } from '../main';

export class RoutineService {
  static getExercises(): string[] {
    const settings = getSettings();
    return settings.workouts || [];
  }

  static addExercise(name: string): void {
    const settings = getSettings();
    const exercises = [...settings.workouts, name.trim()];
    updateSettings({ ...settings, workouts: exercises });
  }

  static removeExercise(index: number): void {
    const settings = getSettings();
    const exercises = settings.workouts.filter((_, i) => i !== index);
    updateSettings({ ...settings, workouts: exercises });
  }

  static updateExercise(index: number, name: string): void {
    const settings = getSettings();
    const exercises = [...settings.workouts];
    exercises[index] = name.trim();
    updateSettings({ ...settings, workouts: exercises });
  }

  static moveExercise(fromIndex: number, toIndex: number): void {
    const settings = getSettings();
    const exercises = [...settings.workouts];
    const [removed] = exercises.splice(fromIndex, 1);
    exercises.splice(toIndex, 0, removed);
    updateSettings({ ...settings, workouts: exercises });
  }

  static getConfig(): RoutineConfig {
    const settings = getSettings();
    return {
      prepDuration: settings.prepDuration,
      workDuration: settings.workDuration,
      restDuration: settings.restDuration,
      rounds: settings.rounds,
      nextExercise: settings.nextExercise,
    };
  }

  static updateConfig(config: Partial<RoutineConfig>): void {
    const settings = getSettings();
    updateSettings({ ...settings, ...config });
  }

  static calculateStats(): RoutineStats {
    const config = this.getConfig();
    const secondsByExercise = config.workDuration + config.restDuration;
    const minutesByExercise = secondsByExercise / 60;
    const totalMinutes = minutesByExercise * config.rounds;
    
    return {
      totalExercises: this.getExercises().length,
      totalMinutes,
    };
  }
}
```

**Verify**: `npx tsc --noEmit src/assets/routine/RoutineService.ts` → exit 0, no errors

### Step 4: Refactor settings.ts to use RoutineService

Update settings functions to use the new service layer.

**Actions**:
1. Modify `src/assets/settings.ts` to:
```typescript
import { updateTextContent } from "@assets/main";
import { RoutineService } from "@assets/routine";

/**
 * Update the total number of workouts in the settings
 */
export function updateTotalWorkouts() {
  const element = document.querySelector(".total-routine-exercises");
  if (!element) return;
  const stats = RoutineService.calculateStats();
  element.textContent = stats.totalExercises.toString();
}

/**
 * Update the total time of the routine
 */
export function updateRoutineStats() {
  const stats = RoutineService.calculateStats();
  updateTextContent(".total-routine-time", stats.totalMinutes.toFixed(1));
  updateTextContent(".total-routine-exercises", stats.totalExercises.toString());
}
```

**Verify**: `npm run build` → exit 0, no errors

### Step 5: Update SettingsRoutineList.astro to use RoutineService

Replace direct storage calls with service layer calls.

**Actions**:
1. Modify `src/components/SettingsRoutineList.astro` imports (lines 95-99):
```typescript
import {
  getSettings,
  updateTextContent,
} from "../assets/main";
import { RoutineService } from "../assets/routine";
```

2. Replace line 132:
```typescript
const exercises = RoutineService.getExercises();
```

3. Replace removeWorkout function (lines 224-230):
```typescript
const removeWorkout = (index: number) => {
  const exercises = RoutineService.getExercises();
  const item = exercises[index];
  if (!confirm(`Are you sure you want to remove "${item}"?`)) return;
  RoutineService.removeExercise(index);
  init();
};
```

4. Replace moveWorkout function (lines 232-242):
```typescript
const moveWorkout = (fromIdx: number, direction: "up" | "down") => {
  const toIdx = direction === "up" ? fromIdx - 1 : fromIdx + 1;
  RoutineService.moveExercise(fromIdx, toIdx);
  updateRoutineList();
};
```

5. Replace addEditWorkout function (lines 244-253):
```typescript
const addEditWorkout = (name: string, idx?: string) => {
  if (!modalAddOrEdit) throw new Error("Modal not found");
  if (!name.trim()) return;
  if (!idx) {
    RoutineService.addExercise(name.trim());
  } else {
    RoutineService.updateExercise(parseInt(idx), name.trim());
  }
  updateRoutineList();
  modalAddOrEdit.close();
};
```

6. Update updateRoutineList function to use exercises (line 158):
```typescript
// Populate list
exercises.forEach((workout, index) => {
```

**Verify**: `npm run build` → exit 0, no errors

### Step 6: Update tests for RoutineService

Create tests for the new service layer.

**Actions**:
1. Create `src/assets/routine/RoutineService.test.ts` with:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RoutineService } from './RoutineService';
import { getSettings, updateSettings } from '../main';

// Mock main module
vi.mock('../main', () => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
}));

describe('RoutineService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getExercises', () => {
    it('should return exercises from settings', () => {
      const mockExercises = ['Jump Squats', 'Push-Ups'];
      vi.mocked(getSettings).mockReturnValue({
        workouts: mockExercises,
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      });

      const result = RoutineService.getExercises();
      expect(result).toEqual(mockExercises);
    });
  });

  describe('addExercise', () => {
    it('should add exercise to settings', () => {
      const mockSettings = {
        workouts: ['Jump Squats'],
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      };
      vi.mocked(getSettings).mockReturnValue(mockSettings);

      RoutineService.addExercise('Push-Ups');

      expect(updateSettings).toHaveBeenCalledWith({
        ...mockSettings,
        workouts: ['Jump Squats', 'Push-Ups'],
      });
    });
  });

  describe('removeExercise', () => {
    it('should remove exercise from settings', () => {
      const mockSettings = {
        workouts: ['Jump Squats', 'Push-Ups'],
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      };
      vi.mocked(getSettings).mockReturnValue(mockSettings);

      RoutineService.removeExercise(0);

      expect(updateSettings).toHaveBeenCalledWith({
        ...mockSettings,
        workouts: ['Push-Ups'],
      });
    });
  });

  describe('calculateStats', () => {
    it('should calculate routine statistics', () => {
      const mockSettings = {
        workouts: ['Jump Squats', 'Push-Ups'],
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      };
      vi.mocked(getSettings).mockReturnValue(mockSettings);

      const stats = RoutineService.calculateStats();

      expect(stats.totalExercises).toBe(2);
      expect(stats.totalMinutes).toBe(4.0); // (20+10)/60 * 8
    });
  });
});
```

**Verify**: `npm run test` → all tests pass (including new tests)

### Step 7: Update existing settings tests

Update `src/assets/settings.test.ts` to work with the new service layer.

**Actions**:
1. Modify `src/assets/settings.test.ts` to mock RoutineService:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { updateTotalWorkouts, updateRoutineStats } from './settings';
import { RoutineService } from './routine';

// Mock RoutineService
vi.mock('./routine', () => ({
  RoutineService: {
    calculateStats: vi.fn(),
  },
}));
```

2. Update tests to use the mock:
```typescript
describe('updateTotalWorkouts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('should update total workouts element when it exists', () => {
    const element = document.createElement('div');
    element.className = 'total-routine-exercises';
    document.body.appendChild(element);
    
    vi.mocked(RoutineService.calculateStats).mockReturnValue({
      totalExercises: 5,
      totalMinutes: 10,
    });

    updateTotalWorkouts();

    expect(element.textContent).toBe('5');
  });
});
```

**Verify**: `npm run test` → all tests pass

## Test plan

- New tests to write:
  - RoutineService unit tests in `src/assets/routine/RoutineService.test.ts`
  - Integration tests for service layer in `src/assets/settings.test.ts`
- Which existing test to use as the structural pattern:
  - Model after `src/assets/settings.test.ts` for structure
- Verification: `npm run test` → all pass, including new tests

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `npm run build` exits 0
- [ ] `npm run test` exits 0; new tests for RoutineService exist and pass
- [ ] `npx tsc --noEmit` exits 0
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The code at the locations in "Current state" doesn't match the excerpts
- A step's verification fails twice after a reasonable fix attempt
- The fix appears to require touching an out-of-scope file
- The existing SettingsRoutineList component cannot be refactored without breaking functionality
- The RoutineService tests fail and cannot be fixed with simple mocking

## Maintenance notes

For the human/agent who owns this code after the change lands:

- All new routine-related features should use RoutineService instead of direct storage access
- The service layer is now the single source of truth for routine business logic
- UI components should only handle presentation, not data manipulation
- Future multiple routines support (Feature 01) will extend this service layer
- Follow-up: Plan 003 will build on this service layer for data structure changes
