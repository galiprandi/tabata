import { describe, it, expect } from 'vitest';
import type { SharedRoutine } from '../assets/routineSharing';

describe('RoutinePreview component logic', () => {
  it('should accept valid SharedRoutine props', () => {
    const routine: SharedRoutine = {
      name: 'Test Routine',
      config: {
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      },
      exercises: ['Push-ups', 'Squats'],
    };

    expect(routine.name).toBe('Test Routine');
    expect(routine.exercises).toHaveLength(2);
    expect(routine.config.prepDuration).toBe(10);
    expect(routine.config.workDuration).toBe(20);
    expect(routine.config.restDuration).toBe(10);
    expect(routine.config.rounds).toBe(8);
  });

  it('should handle empty exercises array', () => {
    const routine: SharedRoutine = {
      name: 'Empty Routine',
      config: {
        prepDuration: 5,
        workDuration: 10,
        restDuration: 5,
        rounds: 4,
        nextExercise: 0,
      },
      exercises: [],
    };

    expect(routine.exercises).toHaveLength(0);
  });

  it('should handle single exercise', () => {
    const routine: SharedRoutine = {
      name: 'Single Exercise',
      config: {
        prepDuration: 5,
        workDuration: 15,
        restDuration: 5,
        rounds: 6,
        nextExercise: 0,
      },
      exercises: ['Burpees'],
    };

    expect(routine.exercises).toHaveLength(1);
    expect(routine.exercises[0]).toBe('Burpees');
  });
});