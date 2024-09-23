import { getSettings } from "@assets/main";

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
  const { workDuration, restDuration, rounds } = getSettings();
  const secondsByExercise = workDuration + restDuration;
  const minutesByExercise = secondsByExercise / 60;
  const roundMinutes = minutesByExercise * rounds;
  element.textContent = roundMinutes.toFixed(1);
}
