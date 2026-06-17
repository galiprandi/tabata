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
