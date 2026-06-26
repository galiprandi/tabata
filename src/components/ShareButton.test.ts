import { describe, it, expect, beforeEach } from 'vitest';
import { compressRoutine } from '../assets/routineSharing';
import type { Routine } from '../assets/routine/RoutineTypes';

describe('ShareButton component logic', () => {
  let mockRoutine: Routine;

  beforeEach(() => {
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

  it('should generate valid share link for routine', () => {
    const result = compressRoutine(mockRoutine);
    expect(result.success).toBe(true);
    expect(result.url).toBeDefined();
    expect(result.url).toContain('?r=');
  });

  it('should generate share link with correct origin', () => {
    const result = compressRoutine(mockRoutine);
    expect(result.success).toBe(true);
    expect(result.url).toContain(window.location.origin);
  });

  it('should handle compression failure gracefully', () => {
    // Test with edge case that might cause issues
    const edgeCase = { ...mockRoutine, name: '' };
    const result = compressRoutine(edgeCase);
    // Should still work with empty name
    expect(result.success).toBe(true);
  });
});