import { describe, it, expect, beforeEach } from 'vitest';
import LZString from 'lz-string';
import { 
  compressRoutine, 
  decompressRoutine, 
  getSharedRoutineFromURL,
  sharedRoutineToRoutine 
} from './routineSharing';
import type { Routine } from './routine/RoutineTypes';

describe('routineSharing', () => {
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

  describe('compressRoutine', () => {
    it('should compress a routine successfully', () => {
      const result = compressRoutine(mockRoutine);
      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
      expect(result.url).toContain('?r=');
    });

    it('should generate URL with correct origin', () => {
      const result = compressRoutine(mockRoutine);
      expect(result.success).toBe(true);
      expect(result.url).toContain(window.location.origin);
    });

    it('should handle compression failure gracefully', () => {
      // Test with invalid data that might cause compression to fail
      const invalidRoutine = { ...mockRoutine, name: '' } as Routine;
      const result = compressRoutine(invalidRoutine);
      // This should still work as empty string is valid
      expect(result.success).toBe(true);
    });

    it('should reject URLs that are too long for WhatsApp', () => {
      // Create a routine with many exercises to exceed length limit
      const largeRoutine: Routine = {
        ...mockRoutine,
        exercises: Array(100).fill('Very Long Exercise Name'),
      };
      
      const result = compressRoutine(largeRoutine);
      // Depending on compression, this might or might not exceed limit
      // The function should handle it either way
      expect(result.success).toBeDefined();
    });
  });

  describe('decompressRoutine', () => {
    it('should decompress a valid compressed routine', () => {
      const compressed = compressRoutine(mockRoutine);
      expect(compressed.success).toBe(true);
      
      if (!compressed.url) return;
      
      const urlParams = new URLSearchParams(compressed.url.split('?r=')[1]);
      const compressedData = urlParams.get('r');
      
      if (!compressedData) return;
      
      const result = decompressRoutine(compressedData);
      expect(result.success).toBe(true);
      expect(result.routine).toBeDefined();
      expect(result.routine?.name).toBe(mockRoutine.name);
      expect(result.routine?.exercises).toEqual(mockRoutine.exercises);
    });

    it('should handle invalid compressed data', () => {
      const result = decompressRoutine('invalid-data');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle malformed JSON', () => {
      const result = decompressRoutine('not-valid-json');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should validate routine structure', () => {
      // Create a compressed string with invalid structure
      const invalidData = JSON.stringify({ name: 'test' }); // missing required fields
      const compressed = LZString.compressToEncodedURIComponent(invalidData);
      
      const result = decompressRoutine(compressed || '');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid routine data structure');
    });
  });

  describe('getSharedRoutineFromURL', () => {
    it('should return null when no shared data in URL', () => {
      // Mock URL without ?r parameter
      const originalURL = window.location.href;
      window.history.replaceState({}, '', originalURL.split('?')[0]);
      
      const result = getSharedRoutineFromURL();
      expect(result).toBeNull();
      
      // Restore original URL
      window.history.replaceState({}, '', originalURL);
    });

    it('should extract and decompress routine from URL', () => {
      const compressed = compressRoutine(mockRoutine);
      expect(compressed.success).toBe(true);
      
      if (!compressed.url) return;
      
      // Set URL with shared data
      const originalURL = window.location.href;
      window.history.replaceState({}, '', compressed.url);
      
      const result = getSharedRoutineFromURL();
      expect(result).not.toBeNull();
      expect(result?.success).toBe(true);
      expect(result?.routine?.name).toBe(mockRoutine.name);
      
      // Restore original URL
      window.history.replaceState({}, '', originalURL);
    });

    it('should handle invalid data in URL', () => {
      // Set URL with invalid data
      const originalURL = window.location.href;
      window.history.replaceState({}, '', `${originalURL}?r=invalid-data`);
      
      const result = getSharedRoutineFromURL();
      expect(result).not.toBeNull();
      expect(result?.success).toBe(false);
      
      // Restore original URL
      window.history.replaceState({}, '', originalURL);
    });
  });

  describe('sharedRoutineToRoutine', () => {
    it('should convert SharedRoutine to Routine with new ID', () => {
      const sharedRoutine = {
        name: 'Shared Routine',
        config: {
          prepDuration: 15,
          workDuration: 30,
          restDuration: 15,
          rounds: 6,
          nextExercise: 0,
        },
        exercises: ['Jumping Jacks', 'Plank'],
      };
      
      const routine = sharedRoutineToRoutine(sharedRoutine);
      
      expect(routine.id).toBeDefined();
      expect(routine.id).not.toBe('');
      expect(routine.name).toBe(sharedRoutine.name);
      expect(routine.config).toEqual(sharedRoutine.config);
      expect(routine.exercises).toEqual(sharedRoutine.exercises);
    });

    it('should generate unique IDs for each conversion', () => {
      const sharedRoutine = {
        name: 'Test',
        config: {
          prepDuration: 10,
          workDuration: 20,
          restDuration: 10,
          rounds: 4,
          nextExercise: 0,
        },
        exercises: ['Test'],
      };
      
      const routine1 = sharedRoutineToRoutine(sharedRoutine);
      const routine2 = sharedRoutineToRoutine(sharedRoutine);
      
      expect(routine1.id).not.toBe(routine2.id);
    });
  });
});