import { describe, it, expect, beforeEach, vi } from "vitest";
import { RoutineService } from "./RoutineService";
import { RoutineStorageService } from "./RoutineStorage";

// Mock main module
vi.mock("../main", () => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
}));

// Mock RoutineStorageService
vi.mock("./RoutineStorage", () => ({
  RoutineStorageService: {
    getActiveRoutine: vi.fn(),
    createRoutine: vi.fn(),
    updateRoutine: vi.fn(),
  },
}));

describe("RoutineService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getExercises", () => {
    it("should return exercises from active routine", () => {
      const mockRoutine = {
        id: "test-id",
        name: "Test",
        config: {
          prepDuration: 10,
          workDuration: 20,
          restDuration: 10,
          rounds: 8,
          nextExercise: 0,
        },
        exercises: ["Jump Squats", "Push-Ups"],
      };
      vi.mocked(RoutineStorageService.getActiveRoutine).mockReturnValue(
        mockRoutine,
      );

      const result = RoutineService.getExercises();
      expect(result).toEqual(mockRoutine.exercises);
    });
  });

  describe("duplicateExercise", () => {
    it("should duplicate an exercise in the active routine", () => {
      const mockRoutine = {
        id: "test-id",
        name: "Test",
        config: {
          prepDuration: 10,
          workDuration: 20,
          restDuration: 10,
          rounds: 8,
          nextExercise: 0,
        },
        exercises: ["Jump Squats", "Push-Ups"],
      };
      vi.mocked(RoutineStorageService.getActiveRoutine).mockReturnValue(
        mockRoutine,
      );

      RoutineService.duplicateExercise(0);

      expect(RoutineStorageService.updateRoutine).toHaveBeenCalledWith(
        "test-id",
        {
          exercises: ["Jump Squats", "Jump Squats", "Push-Ups"],
        },
      );
    });
  });

  describe("calculateStats", () => {
    it("should calculate routine statistics from active routine", () => {
      const mockRoutine = {
        id: "test-id",
        name: "Test",
        config: {
          prepDuration: 10,
          workDuration: 20,
          restDuration: 10,
          rounds: 8,
          nextExercise: 0,
        },
        exercises: ["Jump Squats", "Push-Ups"],
      };
      vi.mocked(RoutineStorageService.getActiveRoutine).mockReturnValue(
        mockRoutine,
      );

      const stats = RoutineService.calculateStats();

      expect(stats.totalExercises).toBe(2);
      expect(stats.totalMinutes).toBe(4.0);
    });
  });
});
