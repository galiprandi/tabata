import { describe, it, expect, beforeEach } from 'vitest';
import { RoutineStorageService } from '../assets/routine';
import { compressRoutine } from '../assets/routineSharing';
import type { Routine } from '../assets/routine/RoutineTypes';

describe('RoutineList component logic', () => {
  let mockRoutine: Routine;

  beforeEach(() => {
    // Clean up localStorage before each test
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

  it('should handle share button click with compressRoutine', () => {
    const result = compressRoutine(mockRoutine);
    expect(result.success).toBe(true);
    expect(result.url).toBeDefined();
  });

  it('should handle routine selection', () => {
    RoutineStorageService.createRoutine(
      mockRoutine.name,
      mockRoutine.config,
      mockRoutine.exercises
    );

    const routines = RoutineStorageService.getRoutines();
    expect(routines.length).toBeGreaterThanOrEqual(1);
    expect(routines[routines.length - 1].name).toBe(mockRoutine.name);
  });

  it('should handle routine deletion', () => {
    RoutineStorageService.createRoutine(
      mockRoutine.name,
      mockRoutine.config,
      mockRoutine.exercises
    );

    const routines = RoutineStorageService.getRoutines();
    const routineToDelete = routines[routines.length - 1];
    
    RoutineStorageService.deleteRoutine(routineToDelete.id);
    const updatedRoutines = RoutineStorageService.getRoutines();
    
    expect(updatedRoutines.length).toBeLessThan(routines.length);
  });
});