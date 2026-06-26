import LZString from 'lz-string';
import type { WorkoutLog } from './workoutLog';

export interface SharedProgress {
  userPseudo: string;
  dateRange: {
    from: number;
    to: number;
  };
  workoutLogs: WorkoutLog[];
  summary: {
    totalWorkouts: number;
    totalDuration: number;
    uniqueRoutines: number;
    streak: number;
  };
}

export interface ShareProgressResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface ProgressDateRange {
  from: number;
  to: number;
  label: string;
}

/**
 * Generates predefined date ranges
 */
export function getDateRanges(): ProgressDateRange[] {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;
  const oneMonth = 30 * oneDay;

  return [
    {
      from: now - oneWeek,
      to: now,
      label: 'Last 7 days',
    },
    {
      from: now - oneMonth,
      to: now,
      label: 'Last 30 days',
    },
    {
      from: 0, // Beginning of time
      to: now,
      label: 'All time',
    },
  ];
}

/**
 * Filters workout logs by date range
 */
export function filterLogsByRange(logs: WorkoutLog[], range: ProgressDateRange): WorkoutLog[] {
  return logs.filter((log) => log.date >= range.from && log.date <= range.to);
}

/**
 * Calculates summary statistics for workout logs
 */
export function calculateSummary(logs: WorkoutLog[]) {
  if (logs.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      uniqueRoutines: 0,
      streak: 0,
    };
  }

  const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
  const uniqueRoutines = new Set(logs.map((log) => log.routineSnapshot.name)).size;
  const streak = calculateStreak(logs);

  return {
    totalWorkouts: logs.length,
    totalDuration,
    uniqueRoutines,
    streak,
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
 * Compresses progress data into a shareable URL
 */
export function compressProgress(
  logs: WorkoutLog[],
  range: ProgressDateRange,
  userPseudo: string = ''
): ShareProgressResult {
  try {
    const filteredLogs = filterLogsByRange(logs, range);
    const summary = calculateSummary(filteredLogs);

    const sharedProgress: SharedProgress = {
      userPseudo,
      dateRange: range,
      workoutLogs: filteredLogs,
      summary,
    };

    const jsonString = JSON.stringify(sharedProgress);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    const url = `${window.location.origin}?progress=${compressed}`;

    return { success: true, url };
  } catch (error) {
    return { success: false, error: 'Failed to compress progress data' };
  }
}

/**
 * Decompresses progress data from URL parameter
 */
export function decompressProgress(): ShareProgressResult {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const progressParam = urlParams.get('progress');

    if (!progressParam) {
      return { success: false, error: 'No progress data in URL' };
    }

    const decompressed = LZString.decompressFromEncodedURIComponent(progressParam);
    const progress = JSON.parse(decompressed) as SharedProgress;

    // Validate structure
    if (!progress.dateRange || !progress.workoutLogs || !progress.summary) {
      return { success: false, error: 'Invalid progress data structure' };
    }

    return { success: true, url: window.location.href };
  } catch (error) {
    return { success: false, error: 'Failed to decompress progress data' };
  }
}