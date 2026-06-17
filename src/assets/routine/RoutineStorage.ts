import { StorageManager } from '../storage';
import type { Routine, RoutineStorage, RoutineConfig } from './RoutineTypes';
import { defaultSettings } from '../defaultSettings';

const ROUTINES_KEY = 'tabata_routines';
const ACTIVE_ROUTINE_KEY = 'tabata_active_routine';

const routineStorageManager = new StorageManager<RoutineStorage>(ROUTINES_KEY, {
  routines: [],
  activeRoutineId: '',
});

const activeRoutineManager = new StorageManager<string>(ACTIVE_ROUTINE_KEY, '');

// UUID v4 generator simple
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class RoutineStorageService {
  static getRoutines(): Routine[] {
    const storage = routineStorageManager.get();
    return storage.routines || [];
  }

  static saveRoutines(routines: Routine[]): void {
    const storage = routineStorageManager.get();
    routineStorageManager.set({
      ...storage,
      routines,
    });
  }

  static getActiveRoutineId(): string {
    return activeRoutineManager.get();
  }

  static setActiveRoutineId(id: string): void {
    activeRoutineManager.set(id);
  }

  static getActiveRoutine(): Routine | null {
    const activeId = this.getActiveRoutineId();
    const routines = this.getRoutines();
    return routines.find((r) => r.id === activeId) || null;
  }

  static createRoutine(name: string, config: RoutineConfig, exercises: string[]): Routine {
    const routine: Routine = {
      id: generateUUID(),
      name: name.trim(),
      config,
      exercises,
    };

    const routines = this.getRoutines();
    routines.push(routine);
    this.saveRoutines(routines);

    // Si es la primera rutina, marcar como activa
    if (routines.length === 1) {
      this.setActiveRoutineId(routine.id);
    }

    return routine;
  }

  static updateRoutine(id: string, updates: Partial<Routine>): void {
    const routines = this.getRoutines();
    const index = routines.findIndex((r) => r.id === id);
    if (index === -1) return;

    routines[index] = { ...routines[index], ...updates };
    this.saveRoutines(routines);
  }

  static deleteRoutine(id: string): void {
    const routines = this.getRoutines();
    const filtered = routines.filter((r) => r.id !== id);
    this.saveRoutines(filtered);

    // Si borramos la rutina activa, seleccionar otra
    const activeId = this.getActiveRoutineId();
    if (activeId === id && filtered.length > 0) {
      this.setActiveRoutineId(filtered[0].id);
    } else if (filtered.length === 0) {
      this.setActiveRoutineId('');
    }
  }

  static migrateFromOldFormat(): void {
    // Verificar si ya migró
    const routines = this.getRoutines();
    if (routines.length > 0) return;

    // Crear rutina por defecto desde settings actuales
    const defaultRoutine: Routine = {
      id: generateUUID(),
      name: 'Mi Rutina',
      config: {
        prepDuration: defaultSettings.prepDuration,
        workDuration: defaultSettings.workDuration,
        restDuration: defaultSettings.restDuration,
        rounds: defaultSettings.rounds,
        nextExercise: defaultSettings.nextExercise,
      },
      exercises: defaultSettings.workouts,
    };

    this.saveRoutines([defaultRoutine]);
    this.setActiveRoutineId(defaultRoutine.id);
  }
}
