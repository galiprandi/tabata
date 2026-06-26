import LZString from 'lz-string';
import type { Routine } from './routine/RoutineTypes';

export interface SharedRoutine {
  name: string;
  config: {
    prepDuration: number;
    workDuration: number;
    restDuration: number;
    rounds: number;
    nextExercise: number;
  };
  exercises: string[];
}

export interface ShareResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface DecompressResult {
  success: boolean;
  routine?: SharedRoutine;
  error?: string;
}

/**
 * Compresses a routine into a shareable URL
 */
export function compressRoutine(routine: Routine): ShareResult {
  try {
    const sharedRoutine: SharedRoutine = {
      name: routine.name,
      config: routine.config,
      exercises: routine.exercises,
    };

    const jsonString = JSON.stringify(sharedRoutine);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    
    if (!compressed) {
      return { success: false, error: 'Failed to compress routine data' };
    }

    const url = `${window.location.origin}${window.location.pathname}?r=${compressed}`;
    
    // Check if URL is too long for WhatsApp (limit ~1000 chars)
    if (url.length > 1000) {
      return { success: false, error: 'Compressed URL is too long for sharing' };
    }

    return { success: true, url };
  } catch (error) {
    return { success: false, error: 'Failed to compress routine data' };
  }
}

/**
 * Decompresses a routine from a URL parameter
 */
export function decompressRoutine(compressedData: string): DecompressResult {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
    
    if (!decompressed) {
      return { success: false, error: 'Failed to decompress routine data' };
    }

    const routine = JSON.parse(decompressed) as SharedRoutine;
    
    // Validate structure
    if (!routine.name || !Array.isArray(routine.exercises) ||
        !routine.config ||
        typeof routine.config.prepDuration !== 'number' ||
        typeof routine.config.workDuration !== 'number' ||
        typeof routine.config.restDuration !== 'number' ||
        typeof routine.config.rounds !== 'number') {
      return { success: false, error: 'Invalid routine data structure' };
    }

    return { success: true, routine };
  } catch (error) {
    return { success: false, error: 'Failed to parse routine data' };
  }
}

/**
 * Extracts shared routine from current URL
 */
export function getSharedRoutineFromURL(): DecompressResult | null {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedData = urlParams.get('r');
  
  if (!sharedData) {
    return null;
  }

  return decompressRoutine(sharedData);
}

/**
 * Converts SharedRoutine back to Routine (with new ID)
 */
export function sharedRoutineToRoutine(shared: SharedRoutine): Routine {
  return {
    id: crypto.randomUUID(),
    name: shared.name,
    config: shared.config,
    exercises: shared.exercises,
  };
}