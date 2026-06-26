import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { calculateBasicAnalysis } from './basicAnalysis';
import type { WorkoutLog } from './workoutLog';

describe('basicAnalysis', () => {
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
    // Clean up
  });

  describe('calculateBasicAnalysis', () => {
    it('should return zero analysis for empty logs', () => {
      const result = calculateBasicAnalysis([]);
      expect(result.totalWorkouts).toBe(0);
      expect(result.consistency).toBe(0);
      expect(result.averageIntensity).toBe(0);
    });

    it('should calculate basic analysis metrics', () => {
      const result = calculateBasicAnalysis(mockLogs);
      expect(result.totalWorkouts).toBe(2);
      expect(result.averageIntensity).toBe(350);
      expect(result.currentStreak).toBeGreaterThanOrEqual(0);
    });

    it('should calculate consistency', () => {
      const result = calculateBasicAnalysis(mockLogs);
      expect(result.consistency).toBeGreaterThan(0);
      expect(result.consistency).toBeLessThanOrEqual(100);
    });

    it('should calculate trends', () => {
      const result = calculateBasicAnalysis(mockLogs);
      expect(result.trends).toBeDefined();
    });

    it('should calculate KPIs', () => {
      const result = calculateBasicAnalysis(mockLogs);
      expect(result.kpis).toBeDefined();
      expect(result.kpis.length).toBeGreaterThan(0);
    });
  });
});