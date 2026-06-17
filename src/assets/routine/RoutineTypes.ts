export interface RoutineConfig {
  prepDuration: number;
  workDuration: number;
  restDuration: number;
  rounds: number;
  nextExercise: number;
}

export interface Routine {
  id: string;           // UUID v4
  name: string;         // "Full Body", "Cardio", etc.
  config: RoutineConfig;
  exercises: string[];
}

export interface RoutineStats {
  totalExercises: number;
  totalMinutes: number;
}

export interface RoutineStorage {
  routines: Routine[];
  activeRoutineId: string;  // Última rutina seleccionada
}
