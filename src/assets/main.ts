import { defaultSettings } from "@assets/defaultSettings";
import { getAudioStatus } from "@assets/audio";

export const storageKey = "settings";

declare global {
  interface Window {
    timer: any;
    audioContext: AudioContext;
    dataLayer: any[];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  wakeLock();
});

// Listen for wake lock release
async function wakeLock() {
  try {
    const wakeLock = await navigator?.wakeLock?.request();
    wakeLock?.addEventListener("release", () => {
      console.log(`Screen Wake Lock released: ${wakeLock.released}`);
    });
  } catch (error) {}
}

// Get settings from local storage
export function getSettings() {
  let storageConfig = localStorage.getItem(storageKey);
  if (!storageConfig) {
    localStorage.setItem(storageKey, JSON.stringify(defaultSettings));
    storageConfig = JSON.stringify(defaultSettings);
  }
  const settings = JSON.parse(storageConfig) as typeof defaultSettings;
  if (!settings.rounds) settings.rounds = settings.workouts.length;
  if (!settings.nextExercise) settings.nextExercise = 0;
  return settings;
}

// Update settings in local storage
export function updateSettings(settings: typeof defaultSettings) {
  localStorage.setItem(storageKey, JSON.stringify(settings));
}

// Sleep function and remove all timers
export function delaySeconds(seconds: number) {
  return new Promise(
    (resolve) => (window.timer = setTimeout(resolve, seconds * 1000)),
  );
}

// Text to speech function
export const textToSpeech = (text: string, force = false) => {
  const audioEnable = getAudioStatus();
  try {
    if (!("speechSynthesis" in window)) return;
    if (!force && !audioEnable) return;

    const voiceLanguage =
      localStorage.getItem("voiceLanguage") ?? navigator.language;
    const utterance = new SpeechSynthesisUtterance();

    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 0.8;
    utterance.text = text;
    utterance.lang = voiceLanguage;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  } catch (error) {
    console.error(error);
  }
};

// Update innerHTML of element
export const updateTextContent = (selector: string, text: string) =>
  document.querySelectorAll(selector).forEach((el) => {
    el.textContent = text;
  });

// Send event to Google Analytics. Eg: Track when user Start Workout
export const gaEvent = (name: EventsName) => {
  if (!window.gtag) return;
  window.gtag("event", name);
};

type EventsName = "Start Workout";
