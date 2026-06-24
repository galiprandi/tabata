import type { RoutineConfig, RoutineStats } from "./RoutineTypes";
import { RoutineStorageService } from "./RoutineStorage";
import { getSettings, updateSettings } from "../main";

export class RoutineService {
  static getExercises(): string[] {
    const activeRoutine = RoutineStorageService.getActiveRoutine();
    if (activeRoutine) {
      return activeRoutine.exercises;
    }
    // Fallback a formato antiguo
    const settings = getSettings();
    return settings.workouts || [];
  }

  static addExercise(name: string): void {
    const activeRoutine = RoutineStorageService.getActiveRoutine();
    if (activeRoutine) {
      const exercises = [...activeRoutine.exercises, name.trim()];
      RoutineStorageService.updateRoutine(activeRoutine.id, { exercises });
    } else {
      // Fallback a formato antiguo
      const settings = getSettings();
      const exercises = [...settings.workouts, name.trim()];
      updateSettings({ ...settings, workouts: exercises });
    }
  }

  static duplicateExercise(index: number): void {
    const activeRoutine = RoutineStorageService.getActiveRoutine();
    if (activeRoutine) {
      const exercises = [...activeRoutine.exercises];
      const workout = exercises[index];
      exercises.splice(index + 1, 0, workout);
      RoutineStorageService.updateRoutine(activeRoutine.id, { exercises });
    } else {
      // Fallback a formato antiguo
      const settings = getSettings();
      const exercises = [...settings.workouts];
      const workout = exercises[index];
      exercises.splice(index + 1, 0, workout);
      updateSettings({ ...settings, workouts: exercises });
    }
  }

  static removeExercise(index: number): void {
    const activeRoutine = RoutineStorageService.getActiveRoutine();
    if (activeRoutine) {
      const exercises = activeRoutine.exercises.filter((_, i) => i !== index);
      RoutineStorageService.updateRoutine(activeRoutine.id, { exercises });
    } else {
      // Fallback a formato antiguo
      const settings = getSettings();
      const exercises = settings.workouts.filter((_, i) => i !== index);
      updateSettings({ ...settings, workouts: exercises });
    }
  }

  static updateExercise(index: number, name: string): void {
    const activeRoutine = RoutineStorageService.getActiveRoutine();
    if (activeRoutine) {
      const exercises = [...activeRoutine.exercises];
      exercises[index] = name.trim();
      RoutineStorageService.updateRoutine(activeRoutine.id, { exercises });
    } else {
      // Fallback a formato antiguo
      const settings = getSettings();
      const exercises = [...settings.workouts];
      exercises[index] = name.trim();
      updateSettings({ ...settings, workouts: exercises });
    }
  }

  static moveExercise(fromIndex: number, toIndex: number): void {
    const activeRoutine = RoutineStorageService.getActiveRoutine();
    if (activeRoutine) {
      const exercises = [...activeRoutine.exercises];
      const [removed] = exercises.splice(fromIndex, 1);
      exercises.splice(toIndex, 0, removed);
      RoutineStorageService.updateRoutine(activeRoutine.id, { exercises });
    } else {
      // Fallback a formato antiguo
      const settings = getSettings();
      const exercises = [...settings.workouts];
      const [removed] = exercises.splice(fromIndex, 1);
      exercises.splice(toIndex, 0, removed);
      updateSettings({ ...settings, workouts: exercises });
    }
  }

  static getConfig(): RoutineConfig {
    const activeRoutine = RoutineStorageService.getActiveRoutine();
    if (activeRoutine) {
      return activeRoutine.config;
    }
    // Fallback a formato antiguo
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
    const activeRoutine = RoutineStorageService.getActiveRoutine();
    if (activeRoutine) {
      const currentConfig = activeRoutine.config;
      const newConfig = { ...currentConfig, ...config };
      RoutineStorageService.updateRoutine(activeRoutine.id, {
        config: newConfig,
      });
    } else {
      // Fallback a formato antiguo
      const settings = getSettings();
      updateSettings({ ...settings, ...config });
    }
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
