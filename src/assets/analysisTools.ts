import type { WorkoutLog } from './workoutLog';

export interface AnalysisNote {
  id: string;
  studentId: string;
  date: number;
  text: string;
  analysisContext: {
    dateRange: { from: number; to: number };
    filters: any;
  };
}

export interface FilterState {
  dateRange?: { from: number; to: number };
  routines?: string[];
  exercises?: string[];
}

const STORAGE_KEY = 'tabata_trainer_notes';

/**
 * Saves a note to localStorage
 */
export function saveNote(note: AnalysisNote): void {
  try {
    const notes = getNotes();
    notes.push(note);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving note:', error);
  }
}

/**
 * Gets all notes from localStorage
 */
export function getNotes(): AnalysisNote[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
}

/**
 * Deletes a note by ID
 */
export function deleteNote(noteId: string): void {
  try {
    const notes = getNotes();
    const filtered = notes.filter((note) => note.id !== noteId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting note:', error);
  }
}

/**
 * Gets notes for a specific student
 */
export function getNotesForStudent(studentId: string): AnalysisNote[] {
  const notes = getNotes();
  return notes.filter((note) => note.studentId === studentId);
}

/**
 * Applies filters to workout logs
 */
export function applyFilters(logs: WorkoutLog[], filters: FilterState): WorkoutLog[] {
  let filtered = [...logs];

  if (filters.dateRange) {
    filtered = filtered.filter(
      (log) => log.date >= filters.dateRange!.from && log.date <= filters.dateRange!.to
    );
  }

  if (filters.routines && filters.routines.length > 0) {
    filtered = filtered.filter((log) => filters.routines!.includes(log.routineSnapshot.name));
  }

  if (filters.exercises && filters.exercises.length > 0) {
    filtered = filtered.filter((log) =>
      log.routineSnapshot.exercises.some((ex) => filters.exercises!.includes(ex))
    );
  }

  return filtered;
}

/**
 * Exports data to CSV
 */
export function exportToCSV(logs: WorkoutLog[], filename: string = 'workout_data.csv'): void {
  const headers = ['Date', 'Routine', 'Duration', 'Exercises'];
  const rows = logs.map((log) => [
    new Date(log.date).toLocaleDateString(),
    log.routineSnapshot.name,
    log.duration,
    log.routineSnapshot.exercises.join(', '),
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports data to JSON
 */
export function exportToJSON(logs: WorkoutLog[], filename: string = 'workout_data.json'): void {
  const jsonContent = JSON.stringify(logs, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}