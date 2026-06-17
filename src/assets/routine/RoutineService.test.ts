import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RoutineService } from './RoutineService';
import { getSettings, updateSettings } from '../main';

// Mock main module
vi.mock('../main', () => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
}));

describe('RoutineService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getExercises', () => {
    it('should return exercises from settings', () => {
      const mockExercises = ['Jump Squats', 'Push-Ups'];
      vi.mocked(getSettings).mockReturnValue({
        workouts: mockExercises,
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
        version: 1,
      });

      const result = RoutineService.getExercises();
      expect(result).toEqual(mockExercises);
    });
  });

  describe('addExercise', () => {
    it('should add exercise to settings', () => {
      const mockSettings = {
        workouts: ['Jump Squats'],
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
        version: 1,
      };
      vi.mocked(getSettings).mockReturnValue(mockSettings);

      RoutineService.addExercise('Push-Ups');

      expect(updateSettings).toHaveBeenCalledWith({
        ...mockSettings,
        workouts: ['Jump Squats', 'Push-Ups'],
      });
    });
  });

  describe('removeExercise', () => {
    it('should remove exercise from settings', () => {
      const mockSettings = {
        workouts: ['Jump Squats', 'Push-Ups'],
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
        version: 1,
      };
      vi.mocked(getSettings).mockReturnValue(mockSettings);

      RoutineService.removeExercise(0);

      expect(updateSettings).toHaveBeenCalledWith({
        ...mockSettings,
        workouts: ['Push-Ups'],
      });
    });
  });

  describe('calculateStats', () => {
    it('should calculate routine statistics', () => {
      const mockSettings = {
        workouts: ['Jump Squats', 'Push-Ups'],
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
        version: 1,
      };
      vi.mocked(getSettings).mockReturnValue(mockSettings);

      const stats = RoutineService.calculateStats();

      expect(stats.totalExercises).toBe(2);
      expect(stats.totalMinutes).toBe(4.0); // (20+10)/60 * 8
    });
  });
});
