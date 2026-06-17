import { describe, it, expect, beforeEach, vi } from 'vitest';
import { updateTotalWorkouts, updateRoutineStats } from './settings';
import { updateTextContent } from './main';
import { RoutineService } from './routine/RoutineService';

// Mock the routine module
vi.mock('./routine/RoutineService', () => ({
  RoutineService: {
    calculateStats: vi.fn(),
  },
}));

// Mock the main module
vi.mock('./main', () => ({
  updateTextContent: vi.fn(),
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
}));

describe('updateTotalWorkouts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('should update total workouts element when it exists', () => {
    const element = document.createElement('div');
    element.className = 'total-routine-exercises';
    document.body.appendChild(element);

    vi.mocked(RoutineService.calculateStats).mockReturnValue({
      totalExercises: 3,
      totalMinutes: 4.0,
    });

    updateTotalWorkouts();

    expect(element.textContent).toBe('3');
  });

  it('should not throw when element does not exist', () => {
    vi.mocked(RoutineService.calculateStats).mockReturnValue({
      totalExercises: 2,
      totalMinutes: 4.0,
    });

    expect(() => updateTotalWorkouts()).not.toThrow();
  });

  it('should handle empty workouts array', () => {
    const element = document.createElement('div');
    element.className = 'total-routine-exercises';
    document.body.appendChild(element);

    vi.mocked(RoutineService.calculateStats).mockReturnValue({
      totalExercises: 0,
      totalMinutes: 0.0,
    });

    updateTotalWorkouts();

    expect(element.textContent).toBe('0');
  });
});

describe('updateRoutineStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate and update routine time and exercises', () => {
    vi.mocked(RoutineService.calculateStats).mockReturnValue({
      totalExercises: 8,
      totalMinutes: 4.0,
    });

    updateRoutineStats();

    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-time', '4.0');
    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-exercises', '8');
  });

  it('should handle different durations', () => {
    vi.mocked(RoutineService.calculateStats).mockReturnValue({
      totalExercises: 4,
      totalMinutes: 3.0,
    });

    updateRoutineStats();

    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-time', '3.0');
    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-exercises', '4');
  });

  it('should handle zero rounds', () => {
    vi.mocked(RoutineService.calculateStats).mockReturnValue({
      totalExercises: 0,
      totalMinutes: 0.0,
    });

    updateRoutineStats();

    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-time', '0.0');
    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-exercises', '0');
  });

  it('should handle large numbers', () => {
    vi.mocked(RoutineService.calculateStats).mockReturnValue({
      totalExercises: 10,
      totalMinutes: 15.0,
    });

    updateRoutineStats();

    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-time', '15.0');
    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-exercises', '10');
  });
});
