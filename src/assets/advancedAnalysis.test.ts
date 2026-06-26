import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  calculateRoutineComparison,
  calculateExerciseAnalysis,
  calculateTemporalPatterns,
  comparePeriods,
} from './advancedAnalysis';
import type { WorkoutLog } from './workoutLog';

describe('advancedAnalysis', () => {
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
          exercises: ['Push-ups', 'Squats'],
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
          exercises: ['Burpees', 'Squats'],
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
    // Clean up
  });

  describe('calculateRoutineComparison', () => {
    it('should return empty array for empty logs', () => {
      const result = calculateRoutineComparison([]);
      expect(result).toEqual([]);
    });

    it('should calculate routine comparison metrics', () => {
      const result = calculateRoutineComparison(mockLogs);
      expect(result).toHaveLength(2);
      expect(result[0].count).toBe(1);
    });

    it('should calculate frequency by day', () => {
      const result = calculateRoutineComparison(mockLogs);
      expect(result[0].frequencyByDay).toHaveLength(7);
    });
  });

  describe('calculateExerciseAnalysis', () => {
    it('should return empty array for empty logs', () => {
      const result = calculateExerciseAnalysis([]);
      expect(result).toEqual([]);
    });

    it('should calculate exercise analysis metrics', () => {
      const result = calculateExerciseAnalysis(mockLogs);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should calculate co-occurrences', () => {
      const result = calculateExerciseAnalysis(mockLogs);
      const squats = result.find((e) => e.name === 'Squats');
      expect(squats).toBeDefined();
      expect(squats!.coOccurrences.length).toBeGreaterThan(0);
    });
  });

  describe('calculateTemporalPatterns', () => {
    it('should return empty patterns for empty logs', () => {
      const result = calculateTemporalPatterns([]);
      expect(result).toHaveLength(7);
      expect(result.every((p) => p.count === 0)).toBe(true);
    });

    it('should calculate temporal patterns', () => {
      const result = calculateTemporalPatterns(mockLogs);
      expect(result).toHaveLength(7);
      expect(result.some((p) => p.count > 0)).toBe(true);
    });

    it('should calculate percentages correctly', () => {
      const result = calculateTemporalPatterns(mockLogs);
      const totalPercentage = result.reduce((sum, p) => sum + p.percentage, 0);
      expect(totalPercentage).toBeCloseTo(100, 0);
    });
  });

  describe('comparePeriods', () => {
    it('should compare two periods', () => {
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      
      const result = comparePeriods(
        mockLogs,
        now - oneWeek * 2,
        now - oneWeek,
        now - oneWeek,
        now
      );
      
      expect(result.period1).toBeDefined();
      expect(result.period2).toBeDefined();
      expect(result.delta).toBeDefined();
    });
  });
});