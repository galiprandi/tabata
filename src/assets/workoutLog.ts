import type { Routine } from './routine/RoutineTypes';

export interface WorkoutLog {
  id: string;
  date: number; // timestamp
  duration: number; // duración real en segundos
  routineSnapshot: {
    name: string;
    exercises: string[];
    config: {
      prepDuration: number;
      workDuration: number;
      restDuration: number;
      rounds: number;
      nextExercise: number;
    };
  };
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  currentStreak: number;
  averageWorkoutsPerWeek: number;
}

export interface RoutineStats {
  name: string;
  count: number;
  lastWorkout: number;
  totalDuration: number;
  averageDuration: number;
}

export interface ExerciseStats {
  name: string;
  count: number;
  totalDuration: number;
}

const STORAGE_KEY = 'tabata_workout_logs';
const MAX_LOGS = 100;

export class WorkoutLogService {
  static getLogs(): WorkoutLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading workout logs:', error);
      return [];
    }
  }

  static saveLogs(logs: WorkoutLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving workout logs:', error);
    }
  }

  static addLog(routine: Routine, duration: number): WorkoutLog {
    const logs = this.getLogs();
    
    const newLog: WorkoutLog = {
      id: crypto.randomUUID(),
      date: Date.now(),
      duration,
      routineSnapshot: {
        name: routine.name,
        exercises: [...routine.exercises],
        config: { ...routine.config },
      },
    };

    // Add to beginning (most recent first)
    logs.unshift(newLog);

    // Keep only MAX_LOGS most recent
    if (logs.length > MAX_LOGS) {
      logs.splice(MAX_LOGS);
    }

    this.saveLogs(logs);
    return newLog;
  }

  static clearLogs(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static getStats(): WorkoutStats {
    const logs = this.getLogs();
    
    if (logs.length === 0) {
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        currentStreak: 0,
        averageWorkoutsPerWeek: 0,
      };
    }

    const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
    const currentStreak = this.calculateStreak(logs);
    const averageWorkoutsPerWeek = this.calculateAveragePerWeek(logs);

    return {
      totalWorkouts: logs.length,
      totalDuration,
      currentStreak,
      averageWorkoutsPerWeek,
    };
  }

  static getRoutineStats(): RoutineStats[] {
    const logs = this.getLogs();
    const routineMap = new Map<string, RoutineStats>();

    logs.forEach((log) => {
      const name = log.routineSnapshot.name;
      const existing = routineMap.get(name);

      if (existing) {
        existing.count++;
        existing.totalDuration += log.duration;
        if (log.date > existing.lastWorkout) {
          existing.lastWorkout = log.date;
        }
      } else {
        routineMap.set(name, {
          name,
          count: 1,
          lastWorkout: log.date,
          totalDuration: log.duration,
          averageDuration: log.duration,
        });
      }
    });

    // Calculate averages
    routineMap.forEach((stats) => {
      stats.averageDuration = stats.totalDuration / stats.count;
    });

    return Array.from(routineMap.values()).sort((a, b) => b.count - a.count);
  }

  static getExerciseStats(): ExerciseStats[] {
    const logs = this.getLogs();
    const exerciseMap = new Map<string, ExerciseStats>();

    logs.forEach((log) => {
      const { exercises, config } = log.routineSnapshot;
      const exerciseDuration = config.workDuration + config.restDuration;

      exercises.forEach((exercise) => {
        const existing = exerciseMap.get(exercise);

        if (existing) {
          existing.count++;
          existing.totalDuration += exerciseDuration;
        } else {
          exerciseMap.set(exercise, {
            name: exercise,
            count: 1,
            totalDuration: exerciseDuration,
          });
        }
      });
    });

    return Array.from(exerciseMap.values()).sort((a, b) => b.count - a.count);
  }

  private static calculateStreak(logs: WorkoutLog[]): number {
    if (logs.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const oneDay = 24 * 60 * 60 * 1000;
    let streak = 0;
    let currentDate = todayTimestamp;

    // Check if there's a workout today
    const hasWorkoutToday = logs.some((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === todayTimestamp;
    });

    if (!hasWorkoutToday) {
      // If no workout today, check yesterday
      currentDate -= oneDay;
    }

    for (let i = 0; i < 365; i++) {
      const hasWorkoutOnDate = logs.some((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === currentDate;
      });

      if (hasWorkoutOnDate) {
        streak++;
        currentDate -= oneDay;
      } else {
        break;
      }
    }

    return streak;
  }

  private static calculateAveragePerWeek(logs: WorkoutLog[]): number {
    if (logs.length === 0) return 0;

    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - oneWeek;

    const recentLogs = logs.filter((log) => log.date > oneWeekAgo);
    return recentLogs.length;
  }
}