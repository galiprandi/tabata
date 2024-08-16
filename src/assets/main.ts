import { defaultSettings } from './defaultSettings'

export const storageKey = 'settings'

declare global {
  interface Window {
    timer: NodeJS.Timeout
  }
}

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

// Change container class function
export function switchBodyClass(className: string) {
  const container = document.body
  if (!container) return
  container.className = `${className}`
}

// Sleep function and remove all timers
export function delaySeconds(seconds: number) {
  return new Promise(
    resolve => (window.timer = setTimeout(resolve, seconds * 1000))
  )
}

// Play sound function
export const play = async (src: Sound) => {
  const playerEl = document.getElementById('player')
  if (!playerEl) return
  await new Audio(`/tabata/sounds/${src}.mp3`).play()
}

type Sound = 'beep' | 'tap'
