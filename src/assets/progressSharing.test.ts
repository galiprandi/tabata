import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getDateRanges,
  filterLogsByRange,
  calculateSummary,
  compressProgress,
  decompressProgress,
} from './progressSharing';
import type { WorkoutLog } from './workoutLog';

describe('progressSharing', () => {
  let mockLogs: WorkoutLog[];

  beforeEach(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    mockLogs = [
      {
        id: 'log-1',
        date: now,
        duration: 300,
        routineSnapshot: {
          name: 'Routine 1',
          exercises: ['Push-ups'],
          config: {
            prepDuration: 10,
            workDuration: 20,
            restDuration: 10,
            rounds: 8,
            nextExercise: 0,
          },
        },
      },
      {
        id: 'log-2',
        date: now - oneDay,
        duration: 400,
        routineSnapshot: {
          name: 'Routine 2',
          exercises: ['Squats'],
          config: {
            prepDuration: 10,
            workDuration: 20,
            restDuration: 10,
            rounds: 8,
            nextExercise: 0,
          },
        },
      },
    ];
  });

  afterEach(() => {
    // Clean up URL
    window.history.replaceState({}, '', window.location.pathname);
  });

  describe('getDateRanges', () => {
    it('should return predefined date ranges', () => {
      const ranges = getDateRanges();
      expect(ranges).toHaveLength(3);
      expect(ranges[0].label).toBe('Last 7 days');
      expect(ranges[1].label).toBe('Last 30 days');
      expect(ranges[2].label).toBe('All time');
    });
  });

  describe('filterLogsByRange', () => {
    it('should filter logs by date range', () => {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const range = {
        from: now - oneDay,
        to: now,
        label: 'Last 7 days',
      };

      const filtered = filterLogsByRange(mockLogs, range);
      expect(filtered.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty array when no logs in range', () => {
      const range = {
        from: Date.now() + 1000000,
        to: Date.now() + 2000000,
        label: 'Future',
      };

      const filtered = filterLogsByRange(mockLogs, range);
      expect(filtered).toHaveLength(0);
    });
  });

  describe('calculateSummary', () => {
    it('should calculate summary for logs', () => {
      const summary = calculateSummary(mockLogs);
      expect(summary.totalWorkouts).toBe(2);
      expect(summary.totalDuration).toBe(700);
      expect(summary.uniqueRoutines).toBe(2);
    });

    it('should return zero summary for empty logs', () => {
      const summary = calculateSummary([]);
      expect(summary.totalWorkouts).toBe(0);
      expect(summary.totalDuration).toBe(0);
    });
  });

  describe('compressProgress', () => {
    it('should compress progress data successfully', () => {
      const ranges = getDateRanges();
      const result = compressProgress(mockLogs, ranges[0], 'TestUser');
      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
      expect(result.url).toContain('?progress=');
    });

    it('should include user pseudo in compressed data', () => {
      const ranges = getDateRanges();
      const result = compressProgress(mockLogs, ranges[0], 'TestUser');
      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
    });
  });

  describe('decompressProgress', () => {
    it('should return error when no progress in URL', () => {
      const result = decompressProgress();
      expect(result.success).toBe(false);
      expect(result.error).toBe('No progress data in URL');
    });
  });
});