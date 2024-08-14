import { defaultSettings } from './defaultSettings'

export const storageKey = 'settings'

// Get settings from local storage
export function getSettings() {
  let storageConfig = localStorage.getItem(storageKey)
  if (!storageConfig) {
    localStorage.setItem(storageKey, JSON.stringify(defaultSettings))
    storageConfig = JSON.stringify(defaultSettings)
  }
  return JSON.parse(storageConfig) as typeof defaultSettings
}

// Update settings in local storage
export function updateSettings(settings: typeof defaultSettings) {
  localStorage.setItem(storageKey, JSON.stringify(settings))
}
