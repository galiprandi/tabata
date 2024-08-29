import { getSettings } from "./main";

/**
 * Update the total number of workouts in the settings
 */
export function updateTotalWorkouts() {
  const element = document.querySelector(".total-workouts-exercises");
  if (!element) return;
  const { workouts } = getSettings();
  element.textContent = workouts.length.toString();
}

/**
 * Update the total time of the routine
 */
export function updateRoutineTime() {
  const element = document.querySelector(".total-routine-time");
  if (!element) return;
  const { workouts, prepDuration, workDuration, restDuration } = getSettings();
  const totalWorkouts = workouts.length;
  const minutesByExercise = workDuration + restDuration;
  const routineTime = (totalWorkouts * minutesByExercise) / 60;
  element.textContent = routineTime.toFixed(1);
}
