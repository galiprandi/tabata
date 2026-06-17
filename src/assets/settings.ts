import { updateTextContent } from "@assets/main";
import { RoutineService } from "@assets/routine";

/**
 * Update the total number of workouts in the settings
 */
export function updateTotalWorkouts() {
  const element = document.querySelector(".total-routine-exercises");
  if (!element) return;
  const stats = RoutineService.calculateStats();
  element.textContent = stats.totalExercises.toString();
}

/**
 * Update the total time of the routine
 */
export function updateRoutineStats() {
  const stats = RoutineService.calculateStats();
  updateTextContent(".total-routine-time", stats.totalMinutes.toFixed(1));
  updateTextContent(".total-routine-exercises", stats.totalExercises.toString());
}
