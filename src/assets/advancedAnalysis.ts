import type { WorkoutLog } from './workoutLog';

export interface RoutineComparison {
  name: string;
  count: number;
  totalDuration: number;
  averageDuration: number;
  lastUsed: number;
  frequencyByDay: number[]; // 0-6 for Sunday-Saturday
}

export interface ExerciseAnalysis {
  name: string;
  count: number;
  totalDuration: number;
  frequencyOverTime: { date: number; count: number }[];
  coOccurrences: { exercise: string; count: number }[];
}

export interface TemporalPattern {
  dayOfWeek: number; // 0-6
  count: number;
  percentage: number;
}

export interface PeriodComparison {
  period1: {
    totalWorkouts: number;
    totalDuration: number;
    averageDuration: number;
  };
  period2: {
    totalWorkouts: number;
    totalDuration: number;
    averageDuration: number;
  };
  delta: {
    workouts: number;
    duration: number;
    intensity: number;
  };
}

/**
 * Calculates routine comparison metrics
 */
export function calculateRoutineComparison(logs: WorkoutLog[]): RoutineComparison[] {
  const routineMap = new Map<string, RoutineComparison>();

  logs.forEach((log) => {
    const name = log.routineSnapshot.name;
    const dayOfWeek = new Date(log.date).getDay();
    const existing = routineMap.get(name);

    if (existing) {
      existing.count++;
      existing.totalDuration += log.duration;
      existing.frequencyByDay[dayOfWeek]++;
      if (log.date > existing.lastUsed) {
        existing.lastUsed = log.date;
      }
    } else {
      const frequencyByDay = new Array(7).fill(0);
      frequencyByDay[dayOfWeek] = 1;
      routineMap.set(name, {
        name,
        count: 1,
        totalDuration: log.duration,
        averageDuration: log.duration,
        lastUsed: log.date,
        frequencyByDay,
      });
    }
  });

  // Calculate averages
  routineMap.forEach((comparison) => {
    comparison.averageDuration = comparison.totalDuration / comparison.count;
  });

  return Array.from(routineMap.values()).sort((a, b) => b.count - a.count);
}

/**
 * Calculates exercise analysis metrics
 */
export function calculateExerciseAnalysis(logs: WorkoutLog[]): ExerciseAnalysis[] {
  const exerciseMap = new Map<string, ExerciseAnalysis>();

  logs.forEach((log) => {
    const { exercises, config } = log.routineSnapshot;
    const exerciseDuration = config.workDuration + config.restDuration;

    exercises.forEach((exercise) => {
      const existing = exerciseMap.get(exercise);

      if (existing) {
        existing.count++;
        existing.totalDuration += exerciseDuration;
        existing.frequencyOverTime.push({ date: log.date, count: 1 });
      } else {
        exerciseMap.set(exercise, {
          name: exercise,
          count: 1,
          totalDuration: exerciseDuration,
          frequencyOverTime: [{ date: log.date, count: 1 }],
          coOccurrences: [],
        });
      }
    });

    // Calculate co-occurrences
    for (let i = 0; i < exercises.length; i++) {
      for (let j = i + 1; j < exercises.length; j++) {
        const ex1 = exercises[i];
        const ex2 = exercises[j];

        // Add co-occurrence for ex1
        const analysis1 = exerciseMap.get(ex1);
        if (analysis1) {
          const existingCo = analysis1.coOccurrences.find((c) => c.exercise === ex2);
          if (existingCo) {
            existingCo.count++;
          } else {
            analysis1.coOccurrences.push({ exercise: ex2, count: 1 });
          }
        }

        // Add co-occurrence for ex2
        const analysis2 = exerciseMap.get(ex2);
        if (analysis2) {
          const existingCo = analysis2.coOccurrences.find((c) => c.exercise === ex1);
          if (existingCo) {
            existingCo.count++;
          } else {
            analysis2.coOccurrences.push({ exercise: ex1, count: 1 });
          }
        }
      }
    }
  });

  return Array.from(exerciseMap.values()).sort((a, b) => b.count - a.count);
}

/**
 * Calculates temporal patterns
 */
export function calculateTemporalPatterns(logs: WorkoutLog[]): TemporalPattern[] {
  const dayCounts = new Array(7).fill(0);

  logs.forEach((log) => {
    const dayOfWeek = new Date(log.date).getDay();
    dayCounts[dayOfWeek]++;
  });

  const total = logs.length;

  return dayCounts.map((count, index) => ({
    dayOfWeek: index,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  }));
}

/**
 * Compares two periods
 */
export function comparePeriods(
  logs: WorkoutLog[],
  period1Start: number,
  period1End: number,
  period2Start: number,
  period2End: number
): PeriodComparison {
  const period1Logs = logs.filter((log) => log.date >= period1Start && log.date <= period1End);
  const period2Logs = logs.filter((log) => log.date >= period2Start && log.date <= period2End);

  const period1Duration = period1Logs.reduce((sum, log) => sum + log.duration, 0);
  const period2Duration = period2Logs.reduce((sum, log) => sum + log.duration, 0);

  const period1Avg = period1Logs.length > 0 ? period1Duration / period1Logs.length : 0;
  const period2Avg = period2Logs.length > 0 ? period2Duration / period2Logs.length : 0;

  return {
    period1: {
      totalWorkouts: period1Logs.length,
      totalDuration: period1Duration,
      averageDuration: period1Avg,
    },
    period2: {
      totalWorkouts: period2Logs.length,
      totalDuration: period2Duration,
      averageDuration: period2Avg,
    },
    delta: {
      workouts: period2Logs.length - period1Logs.length,
      duration: period2Duration - period1Duration,
      intensity: period2Avg - period1Avg,
    },
  };
}