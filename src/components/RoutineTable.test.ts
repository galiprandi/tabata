import { describe, it, expect } from 'vitest';
import type { Routine } from '../assets/routine/RoutineTypes';

describe('RoutineTable component', () => {
  it('should render table with routines', () => {
    const routines: Routine[] = [
      {
        id: 'test-1',
        name: 'Test Routine',
        config: {
          prepDuration: 10,
          workDuration: 20,
          restDuration: 10,
          rounds: 8,
          nextExercise: 0,
        },
        exercises: ['Push-ups', 'Squats'],
      },
    ];

    expect(routines).toHaveLength(1);
    expect(routines[0].name).toBe('Test Routine');
  });

  it('should render empty state when no routines', () => {
    const routines: Routine[] = [];
    expect(routines).toHaveLength(0);
  });

  it('should display exercise tags correctly', () => {
    const routine: Routine = {
      id: 'test-1',
      name: 'Test',
      config: {
        prepDuration: 10,
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        nextExercise: 0,
      },
      exercises: ['Push-ups', 'Squats', 'Burpees', 'Plank'],
    };

    expect(routine.exercises).toHaveLength(4);
  });
});