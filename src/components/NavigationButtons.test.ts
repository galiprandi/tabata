import { describe, it, expect } from "vitest";
import { dictionary, t } from "../assets/dictionary";

describe("Navigation buttons keyboard shortcut hints", () => {
  it("contains shortcut hint entries in dictionary", () => {
    expect(dictionary["Configure routine (S)"]).toBeDefined();
    expect(dictionary["Configure routine (S)"].en).toBe("Configure routine (S)");
    expect(dictionary["Configure routine (S)"].es).toBe("Configurar rutina (S)");

    expect(dictionary["See history (H)"]).toBeDefined();
    expect(dictionary["See history (H)"].en).toBe("See history (H)");
    expect(dictionary["See history (H)"].es).toBe("Ver historial (H)");

    expect(dictionary["Start Routine (G)"]).toBeDefined();
    expect(dictionary["Start Routine (G)"].en).toBe("Start Routine (G)");
    expect(dictionary["Start Routine (G)"].es).toBe("Iniciar rutina (G)");

    expect(dictionary["Trainer Mode (T)"]).toBeDefined();
    expect(dictionary["Trainer Mode (T)"].en).toBe("Trainer Mode (T)");
    expect(dictionary["Trainer Mode (T)"].es).toBe("Modo Entrenador (T)");
  });

  it("translates shortcut hints correctly using t()", () => {
    expect(t("Configure routine (S)")).toContain("(S)");
    expect(t("See history (H)")).toContain("(H)");
    expect(t("Start Routine (G)")).toContain("(G)");
    expect(t("Trainer Mode (T)")).toContain("(T)");
  });
});
