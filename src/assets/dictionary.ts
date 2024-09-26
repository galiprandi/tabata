export const dictionary = {
  "Add new item to the list": {
    en: "Add new item to the list",
    es: "Agregar nuevo elemento a la lista",
  },
  Cancel: {
    en: "Cancel",
    es: "Cancelar",
  },
  "Config Routine": {
    en: "Config Routine",
    es: "Configurar Rutina",
  },
  Continue: {
    en: "Continue",
    es: "Continuar",
  },
  Exercise: {
    en: "Exercise",
    es: "Ejercicio",
  },
  "Install App": {
    en: "Install App",
    es: "Instalar App",
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
  "Return to home": {
    en: "Return to home",
    es: "Volver a inicio",
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
  "Share this app with your friends!": {
    en: "Share this app with your friends!",
    es: "¡Comparte esta app con tus amigos!",
  },
  Save: {
    en: "Save",
    es: "Guardar",
  },
  Settings: {
    en: "Settings",
    es: "Ajustes",
  },
  "Start Routine": {
    en: "Start Routine",
    es: "Iniciar rutina",
  },
  "Tap image to share with your friends!": {
    en: "Tap image to share with your friends!",
    es: "¡Toca la imagen para compartirla con tus amigos!",
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

export const initTranslation = () => {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = `${el?.getAttribute("data-i18n")}` as DictionaryKeys;
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-tooltip]").forEach((el) => {
    const tooltip = `${el?.getAttribute("data-tooltip")}` as DictionaryKeys;
    el.setAttribute("data-tooltip", t(tooltip));
  });
};

type AvailableLanguages = "en" | "es";
type DictionaryKeys = keyof typeof dictionary;
