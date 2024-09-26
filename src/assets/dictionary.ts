export const dictionary = {
  Cancel: {
    en: "Cancel",
    es: "Cancelar",
  },
  Continue: {
    en: "Continue",
    es: "Continuar",
  },
  Exercise: {
    en: "Exercise",
    es: "Ejercicio",
  },

  Last: {
    en: "Last",
    es: "Último",
  },
  "First Exercise": {
    en: "First Exercise",
    es: "Primer ejercicio",
  },
  "Go!": {
    en: "Go!",
    es: "¡Vamos!",
  },
  Next: {
    en: "Next",
    es: "Siguiente",
  },
  "Preparation Time": {
    en: "Preparation Time",
    es: "Tiempo de preparación",
  },
  "Rest!": {
    en: "Rest!",
    es: "¡Descansa!",
  },
  Restart: {
    en: "Restart",
    es: "Reiniciar",
  },
  Routine: {
    en: "Routine",
    es: "Rutina",
  },
  "Routine completed!": {
    en: "Routine completed!",
    es: "¡Rutina completada!",
  },
  Save: {
    en: "Save",
    es: "Guardar",
  },
  Settings: {
    en: "Settings",
    es: "Ajustes",
  },
  Train: {
    en: "Train",
    es: "Entrenar",
  },
};

const langs: AvailableLanguages[] = ["en", "es"];

export const t = (key: keyof typeof dictionary) => {
  try {
    const lang = navigator.language.split("-")[0] as AvailableLanguages;
    const userLang: AvailableLanguages = langs.includes(lang) ? lang : "en";
    return dictionary[key][userLang] || dictionary[key]["en"] || key;
  } catch (error) {
    return key;
  }
};

type AvailableLanguages = "en" | "es";
