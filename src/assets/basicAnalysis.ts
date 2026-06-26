import type { WorkoutLog } from './workoutLog';

export interface Trend {
  metric: string;
  current: number;
  previous: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
}

export interface KPI {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface AnalysisResult {
  consistency: number; // percentage
  averageIntensity: number; // based on duration
  totalWorkouts: number;
  currentStreak: number;
  trends: Trend[];
  kpis: KPI[];
}

/**
 * Calculates basic analysis metrics from workout logs
 */
export function calculateBasicAnalysis(logs: WorkoutLog[]): AnalysisResult {
  if (logs.length === 0) {
    return {
      consistency: 0,
      averageIntensity: 0,
      totalWorkouts: 0,
      currentStreak: 0,
      trends: [],
      kpis: [],
    };
  }

  const totalWorkouts = logs.length;
  const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
  const averageIntensity = totalDuration / totalWorkouts;
  const currentStreak = calculateStreak(logs);
  const consistency = calculateConsistency(logs);

  const trends = calculateTrends(logs);
  const kpis = calculateKPIs(logs, consistency, averageIntensity, currentStreak);

  return {
    consistency,
    averageIntensity,
    totalWorkouts,
    currentStreak,
    trends,
    kpis,
  };
}

/**
 * Calculates streak from workout logs
 */
function calculateStreak(logs: WorkoutLog[]): number {
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

/**
 * Calculates consistency as percentage of days trained
 */
function calculateConsistency(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0;

  const dates = logs.map((log) => {
    const date = new Date(log.date);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  });

  const uniqueDates = new Set(dates);
  const firstDate = Math.min(...dates);
  const lastDate = Math.max(...dates);
  const daysSpan = Math.ceil((lastDate - firstDate) / (24 * 60 * 60 * 1000)) + 1;

  return (uniqueDates.size / daysSpan) * 100;
}

/**
 * Calculates basic trends
 */
function calculateTrends(logs: WorkoutLog[]): Trend[] {
  if (logs.length < 2) return [];

  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  const recentLogs = logs.filter((log) => log.date > now - oneWeek);
  const previousLogs = logs.filter((log) => log.date > now - oneWeek * 2 && log.date <= now - oneWeek);

  const recentCount = recentLogs.length;
  const previousCount = previousLogs.length;
  const recentDuration = recentLogs.reduce((sum, log) => sum + log.duration, 0);
  const previousDuration = previousLogs.reduce((sum, log) => sum + log.duration, 0);

  const frequencyChange = previousCount > 0 ? ((recentCount - previousCount) / previousCount) * 100 : 0;
  const durationChange = previousDuration > 0 ? ((recentDuration - previousDuration) / previousDuration) * 100 : 0;

  return [
    {
      metric: 'Frequency',
      current: recentCount,
      previous: previousCount,
      change: frequencyChange,
      direction: frequencyChange > 5 ? 'up' : frequencyChange < -5 ? 'down' : 'stable',
    },
    {
      metric: 'Duration',
      current: recentDuration,
      previous: previousDuration,
      change: durationChange,
      direction: durationChange > 5 ? 'up' : durationChange < -5 ? 'down' : 'stable',
    },
  ];
}

/**
 * Calculates KPIs
 */
function calculateKPIs(
  logs: WorkoutLog[],
  consistency: number,
  averageIntensity: number,
  currentStreak: number
): KPI[] {
  return [
    {
      name: 'Consistency',
      value: consistency,
      unit: '%',
      trend: consistency > 50 ? 'up' : consistency < 30 ? 'down' : 'stable',
      change: 0,
    },
    {
      name: 'Avg Intensity',
      value: averageIntensity,
      unit: 's',
      trend: 'stable',
      change: 0,
    },
    {
      name: 'Current Streak',
      value: currentStreak,
      unit: 'days',
      trend: currentStreak > 7 ? 'up' : currentStreak < 3 ? 'down' : 'stable',
      change: 0,
    },
  ];
}