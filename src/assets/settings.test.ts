import { describe, it, expect, beforeEach, vi } from 'vitest';
import { updateTotalWorkouts, updateRoutineStats } from './settings';
import { getSettings, updateTextContent } from './main';

// Mock the main module
vi.mock('./main', () => ({
  getSettings: vi.fn(),
  updateTextContent: vi.fn(),
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

    vi.mocked(getSettings).mockReturnValue({
      workouts: ['exercise1', 'exercise2', 'exercise3'],
      workDuration: 20,
      restDuration: 10,
      rounds: 8,
      prepDuration: 10,
      nextExercise: 0,
    });

    updateTotalWorkouts();

    expect(element.textContent).toBe('3');
  });

  it('should not throw when element does not exist', () => {
    vi.mocked(getSettings).mockReturnValue({
      workouts: ['exercise1', 'exercise2'],
      workDuration: 20,
      restDuration: 10,
      rounds: 8,
      prepDuration: 10,
      nextExercise: 0,
    });

    expect(() => updateTotalWorkouts()).not.toThrow();
  });

  it('should handle empty workouts array', () => {
    const element = document.createElement('div');
    element.className = 'total-routine-exercises';
    document.body.appendChild(element);

    vi.mocked(getSettings).mockReturnValue({
      workouts: [],
      workDuration: 20,
      restDuration: 10,
      rounds: 8,
      prepDuration: 10,
      nextExercise: 0,
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
    vi.mocked(getSettings).mockReturnValue({
      workDuration: 20,
      restDuration: 10,
      rounds: 8,
      workouts: ['exercise1', 'exercise2'],
      prepDuration: 10,
      nextExercise: 0,
    });

    updateRoutineStats();

    const secondsByExercise = 20 + 10; // 30
    const minutesByExercise = 30 / 60; // 0.5
    const roundMinutes = 0.5 * 8; // 4.0

    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-time', '4.0');
    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-exercises', '8');
  });

  it('should handle different durations', () => {
    vi.mocked(getSettings).mockReturnValue({
      workDuration: 30,
      restDuration: 15,
      rounds: 4,
      workouts: ['exercise1'],
      prepDuration: 10,
      nextExercise: 0,
    });

    updateRoutineStats();

    const secondsByExercise = 30 + 15; // 45
    const minutesByExercise = 45 / 60; // 0.75
    const roundMinutes = 0.75 * 4; // 3.0

    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-time', '3.0');
    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-exercises', '4');
  });

  it('should handle zero rounds', () => {
    vi.mocked(getSettings).mockReturnValue({
      workDuration: 20,
      restDuration: 10,
      rounds: 0,
      workouts: ['exercise1'],
      prepDuration: 10,
      nextExercise: 0,
    });

    updateRoutineStats();

    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-time', '0.0');
    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-exercises', '0');
  });

  it('should handle large numbers', () => {
    vi.mocked(getSettings).mockReturnValue({
      workDuration: 60,
      restDuration: 30,
      rounds: 10,
      workouts: ['exercise1'],
      prepDuration: 10,
      nextExercise: 0,
    });

    updateRoutineStats();

    const secondsByExercise = 60 + 30; // 90
    const minutesByExercise = 90 / 60; // 1.5
    const roundMinutes = 1.5 * 10; // 15.0

    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-time', '15.0');
    expect(updateTextContent).toHaveBeenCalledWith('.total-routine-exercises', '10');
  });
});
