export interface RoutineConfig {
  prepDuration: number;
  workDuration: number;
  restDuration: number;
  rounds: number;
  nextExercise: number;
}

export interface Routine {
  id: string;
  name: string;
  config: RoutineConfig;
  exercises: string[];
}

export interface RoutineStats {
  totalExercises: number;
  totalMinutes: number;
}
