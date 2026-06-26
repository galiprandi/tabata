import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WorkoutLogService } from './workoutLog';
import type { Routine } from './routine/RoutineTypes';

describe('WorkoutLogService', () => {
  let mockRoutine: Routine;

  beforeEach(() => {
    localStorage.clear();
    
    mockRoutine = {
      id: 'test-id',
      name: 'Test Routine',
      config: {
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      },
      exercises: ['Push-ups', 'Squats', 'Burpees'],
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getLogs', () => {
    it('should return empty array when no logs exist', () => {
      const logs = WorkoutLogService.getLogs();
      expect(logs).toEqual([]);
    });

    it('should return saved logs', () => {
      WorkoutLogService.addLog(mockRoutine, 300);
      const logs = WorkoutLogService.getLogs();
      expect(logs).toHaveLength(1);
    });
  });

  describe('addLog', () => {
    it('should add a new log', () => {
      const log = WorkoutLogService.addLog(mockRoutine, 300);
      expect(log.id).toBeDefined();
      expect(log.duration).toBe(300);
      expect(log.routineSnapshot.name).toBe(mockRoutine.name);
    });

    it('should add logs in reverse chronological order', () => {
      WorkoutLogService.addLog(mockRoutine, 300);
      const secondLog = WorkoutLogService.addLog(mockRoutine, 400);
      
      const logs = WorkoutLogService.getLogs();
      expect(logs[0].id).toBe(secondLog.id);
      expect(logs[0].duration).toBe(400);
    });

    it('should limit to 100 logs', () => {
      for (let i = 0; i < 105; i++) {
        WorkoutLogService.addLog(mockRoutine, 300);
      }
      
      const logs = WorkoutLogService.getLogs();
      expect(logs.length).toBe(100);
    });
  });

  describe('clearLogs', () => {
    it('should clear all logs', () => {
      WorkoutLogService.addLog(mockRoutine, 300);
      WorkoutLogService.clearLogs();
      
      const logs = WorkoutLogService.getLogs();
      expect(logs).toEqual([]);
    });
  });

  describe('getStats', () => {
    it('should return zero stats when no logs', () => {
      const stats = WorkoutLogService.getStats();
      expect(stats.totalWorkouts).toBe(0);
      expect(stats.totalDuration).toBe(0);
      expect(stats.currentStreak).toBe(0);
    });

    it('should calculate total workouts', () => {
      WorkoutLogService.addLog(mockRoutine, 300);
      WorkoutLogService.addLog(mockRoutine, 400);
      
      const stats = WorkoutLogService.getStats();
      expect(stats.totalWorkouts).toBe(2);
    });

    it('should calculate total duration', () => {
      WorkoutLogService.addLog(mockRoutine, 300);
      WorkoutLogService.addLog(mockRoutine, 400);
      
      const stats = WorkoutLogService.getStats();
      expect(stats.totalDuration).toBe(700);
    });
  });

  describe('getRoutineStats', () => {
    it('should return empty array when no logs', () => {
      const stats = WorkoutLogService.getRoutineStats();
      expect(stats).toEqual([]);
    });

    it('should calculate stats per routine', () => {
      WorkoutLogService.addLog(mockRoutine, 300);
      WorkoutLogService.addLog(mockRoutine, 400);
      
      const stats = WorkoutLogService.getRoutineStats();
      expect(stats).toHaveLength(1);
      expect(stats[0].name).toBe(mockRoutine.name);
      expect(stats[0].count).toBe(2);
      expect(stats[0].totalDuration).toBe(700);
    });

    it('should calculate average duration', () => {
      WorkoutLogService.addLog(mockRoutine, 300);
      WorkoutLogService.addLog(mockRoutine, 400);
      
      const stats = WorkoutLogService.getRoutineStats();
      expect(stats[0].averageDuration).toBe(350);
    });
  });

  describe('getExerciseStats', () => {
    it('should return empty array when no logs', () => {
      const stats = WorkoutLogService.getExerciseStats();
      expect(stats).toEqual([]);
    });

    it('should calculate stats per exercise', () => {
      WorkoutLogService.addLog(mockRoutine, 300);
      
      const stats = WorkoutLogService.getExerciseStats();
      expect(stats).toHaveLength(3);
      expect(stats[0].name).toBe('Push-ups');
      expect(stats[0].count).toBe(1);
    });

    it('should sort by frequency', () => {
      const routineWithMoreExercises = {
        ...mockRoutine,
        exercises: ['Push-ups', 'Push-ups', 'Squats'],
      };
      WorkoutLogService.addLog(routineWithMoreExercises, 300);
      
      const stats = WorkoutLogService.getExerciseStats();
      expect(stats[0].name).toBe('Push-ups');
      expect(stats[0].count).toBe(2);
    });
  });
});