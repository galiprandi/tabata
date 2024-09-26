import { getSettings, updateTextContent } from "@assets/main";

/**
 * Update the total number of workouts in the settings
 */
export function updateTotalWorkouts() {
  const element = document.querySelector(".total-routine-exercises");
  if (!element) return;
  const { workouts } = getSettings();
  element.textContent = workouts.length.toString();
}

/**
 * Update the total time of the routine
 */
export function updateRoutineStats() {
  const { workDuration, restDuration, rounds } = getSettings();
  const secondsByExercise = workDuration + restDuration;
  const minutesByExercise = secondsByExercise / 60;
  const roundMinutes = minutesByExercise * rounds;
  updateTextContent(".total-routine-time", roundMinutes.toFixed(1));
  updateTextContent(".total-routine-exercises", rounds.toString());
}
