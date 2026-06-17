import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RoutineStorageService } from './RoutineStorage';

// Mock StorageManager
vi.mock('../storage', () => ({
  StorageManager: class {
    // @ts-ignore
    key: string;
    // @ts-ignore
    defaultValue: any;
    constructor(key: string, defaultValue: any) {
      this.key = key;
      this.defaultValue = defaultValue;
    }
    get() {
      const data = localStorage.getItem(this.key);
      if (!data) {
        localStorage.setItem(this.key, JSON.stringify(this.defaultValue));
        return this.defaultValue;
      }
      return JSON.parse(data);
    }
    set(data: any) {
      localStorage.setItem(this.key, JSON.stringify(data));
    }
    remove() {
      localStorage.removeItem(this.key);
    }
    exists() {
      return localStorage.getItem(this.key) !== null;
    }
  },
}));

describe('RoutineStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    // Limpiar también las keys específicas
    localStorage.removeItem('tabata_routines');
    localStorage.removeItem('tabata_active_routine');
  });

  describe('getRoutines', () => {
    it('should return empty array initially', () => {
      const routines = RoutineStorageService.getRoutines();
      expect(routines).toEqual([]);
    });

    it('should return saved routines', () => {
      const routine = {
        id: 'test-id',
        name: 'Test Routine',
        config: {
          prepDuration: 10,
          workDuration: 20,
          restDuration: 10,
          rounds: 8,
          nextExercise: 0,
        },
        exercises: ['Push-ups', 'Squats'],
      };
      RoutineStorageService.createRoutine('Test Routine', routine.config, routine.exercises);

      const routines = RoutineStorageService.getRoutines();
      expect(routines).toHaveLength(1);
      expect(routines[0].name).toBe('Test Routine');
    });
  });

  describe('createRoutine', () => {
    it('should create a new routine', () => {
      const config = {
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      };
      const exercises = ['Push-ups', 'Squats'];

      const routine = RoutineStorageService.createRoutine('Test Routine', config, exercises);

      expect(routine.id).toBeDefined();
      expect(routine.name).toBe('Test Routine');
      expect(routine.config).toEqual(config);
      expect(routine.exercises).toEqual(exercises);
    });

    it('should set as active if first routine', () => {
      const config = {
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      };
      const exercises = ['Push-ups'];

      RoutineStorageService.createRoutine('Test Routine', config, exercises);

      const activeId = RoutineStorageService.getActiveRoutineId();
      expect(activeId).toBeDefined();
    });
  });

  describe('updateRoutine', () => {
    it('should update existing routine', () => {
      const config = {
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      };
      const exercises = ['Push-ups'];

      const routine = RoutineStorageService.createRoutine('Test Routine', config, exercises);
      RoutineStorageService.updateRoutine(routine.id, { name: 'Updated Routine' });

      const routines = RoutineStorageService.getRoutines();
      const updated = routines.find((r) => r.id === routine.id);
      expect(updated?.name).toBe('Updated Routine');
    });
  });

  describe('deleteRoutine', () => {
    it('should delete routine', () => {
      const config = {
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      };
      const exercises = ['Push-ups'];

      const routine = RoutineStorageService.createRoutine('Test Routine', config, exercises);
      RoutineStorageService.deleteRoutine(routine.id);

      const routines = RoutineStorageService.getRoutines();
      const deleted = routines.find((r) => r.id === routine.id);
      expect(deleted).toBeUndefined();
    });

    it('should select another routine if deleting active', () => {
      const config = {
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      };
      const exercises = ['Push-ups'];

      // Crear rutinas manualmente sin usar createRoutine para evitar auto-activación
      const routine1 = {
        id: 'routine-1',
        name: 'Routine 1',
        config,
        exercises,
      };
      const routine2 = {
        id: 'routine-2',
        name: 'Routine 2',
        config,
        exercises,
      };

      RoutineStorageService.saveRoutines([routine1, routine2]);
      RoutineStorageService.setActiveRoutineId(routine1.id);

      // Borrar routine1
      RoutineStorageService.deleteRoutine(routine1.id);

      // Verificar que se seleccionó otra rutina
      const activeAfter = RoutineStorageService.getActiveRoutineId();
      const routines = RoutineStorageService.getRoutines();
      const activeRoutine = routines.find((r) => r.id === activeAfter);
      expect(activeRoutine).toBeDefined();
      expect(activeRoutine?.id).toBe(routine2.id);
    });
  });

  describe('migrateFromOldFormat', () => {
    it('should create default routine from old format', () => {
      RoutineStorageService.migrateFromOldFormat();

      const routines = RoutineStorageService.getRoutines();
      expect(routines.length).toBeGreaterThan(0);
    });

    it('should not migrate if routines already exist', () => {
      const config = {
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      };
      const exercises = ['Push-ups'];

      RoutineStorageService.createRoutine('Existing Routine', config, exercises);
      const countBefore = RoutineStorageService.getRoutines().length;
      
      RoutineStorageService.migrateFromOldFormat();

      const countAfter = RoutineStorageService.getRoutines().length;
      expect(countAfter).toBe(countBefore);
    });
  });
});
