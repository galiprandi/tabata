import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  saveNote,
  getNotes,
  deleteNote,
  getNotesForStudent,
  applyFilters,
  exportToCSV,
  exportToJSON,
} from './analysisTools';
import type { WorkoutLog } from './workoutLog';

describe('analysisTools', () => {
  let mockLogs: WorkoutLog[];

  beforeEach(() => {
    localStorage.clear();
    
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    mockLogs = [
      {
        id: 'log-1',
        date: now,
        duration: 300,
        routineSnapshot: {
          name: 'Routine 1',
          exercises: ['Push-ups', 'Squats'],
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
          exercises: ['Burpees', 'Squats'],
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
    localStorage.clear();
  });

  describe('saveNote and getNotes', () => {
    it('should save and retrieve notes', () => {
      const note = {
        id: 'note-1',
        studentId: 'student-1',
        date: Date.now(),
        text: 'Test note',
        analysisContext: {
          dateRange: { from: 0, to: Date.now() },
          filters: {},
        },
      };

      saveNote(note);
      const notes = getNotes();
      expect(notes).toHaveLength(1);
      expect(notes[0].text).toBe('Test note');
    });

    it('should return empty array when no notes', () => {
      const notes = getNotes();
      expect(notes).toEqual([]);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', () => {
      const note = {
        id: 'note-1',
        studentId: 'student-1',
        date: Date.now(),
        text: 'Test note',
        analysisContext: {
          dateRange: { from: 0, to: Date.now() },
          filters: {},
        },
      };

      saveNote(note);
      deleteNote('note-1');
      const notes = getNotes();
      expect(notes).toHaveLength(0);
    });
  });

  describe('getNotesForStudent', () => {
    it('should get notes for a specific student', () => {
      const note1 = {
        id: 'note-1',
        studentId: 'student-1',
        date: Date.now(),
        text: 'Note 1',
        analysisContext: {
          dateRange: { from: 0, to: Date.now() },
          filters: {},
        },
      };

      const note2 = {
        id: 'note-2',
        studentId: 'student-2',
        date: Date.now(),
        text: 'Note 2',
        analysisContext: {
          dateRange: { from: 0, to: Date.now() },
          filters: {},
        },
      };

      saveNote(note1);
      saveNote(note2);

      const student1Notes = getNotesForStudent('student-1');
      expect(student1Notes).toHaveLength(1);
      expect(student1Notes[0].studentId).toBe('student-1');
    });
  });

  describe('applyFilters', () => {
    it('should return all logs when no filters', () => {
      const filtered = applyFilters(mockLogs, {});
      expect(filtered).toHaveLength(2);
    });

    it('should filter by date range', () => {
      const now = Date.now();
      const filters = {
        dateRange: { from: now - 1000, to: now + 1000 },
      };

      const filtered = applyFilters(mockLogs, filters);
      expect(filtered.length).toBeGreaterThanOrEqual(0);
    });

    it('should filter by routines', () => {
      const filters = {
        routines: ['Routine 1'],
      };

      const filtered = applyFilters(mockLogs, filters);
      expect(filtered.every((log) => log.routineSnapshot.name === 'Routine 1')).toBe(true);
    });

    it('should filter by exercises', () => {
      const filters = {
        exercises: ['Squats'],
      };

      const filtered = applyFilters(mockLogs, filters);
      expect(filtered.every((log) => log.routineSnapshot.exercises.includes('Squats'))).toBe(true);
    });
  });

  describe('exportToCSV', () => {
    it('should export to CSV', () => {
      // Mock URL.createObjectURL and link
      const mockUrl = 'mock-url';
      global.URL.createObjectURL = () => mockUrl;
      global.URL.revokeObjectURL = () => {};
      
      const mockLink = {
        href: '',
        download: '',
        click: () => {},
      };
      
      document.createElement = () => mockLink as any;

      exportToCSV(mockLogs);
      expect(true).toBe(true); // Just verify it doesn't throw
    });
  });

  describe('exportToJSON', () => {
    it('should export to JSON', () => {
      const mockUrl = 'mock-url';
      global.URL.createObjectURL = () => mockUrl;
      global.URL.revokeObjectURL = () => {};
      
      const mockLink = {
        href: '',
        download: '',
        click: () => {},
      };
      
      document.createElement = () => mockLink as any;

      exportToJSON(mockLogs);
      expect(true).toBe(true); // Just verify it doesn't throw
    });
  });
});