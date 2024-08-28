import { defaultSettings } from './defaultSettings'

export const storageKey = 'settings'

declare global {
  interface Window {
    timer: any
  }
}

document.addEventListener('DOMContentLoaded', () => {
  wakeLock()

  // Add tap sound to all elements with class .tap
  const tapButtons = document.querySelectorAll('.tap')
  tapButtons.forEach(button => {
    button.addEventListener('click', async () => {
      await play('tap')
    })
  })
})

// Listen for wake lock release
async function wakeLock() {
  try {
    const wakeLock = await navigator?.wakeLock?.request()
    wakeLock?.addEventListener('release', () => {
      console.log(`Screen Wake Lock released: ${wakeLock.released}`)
    })
  } catch (error) {}
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

// Get audio status
const audioEnable = () => !!localStorage.getItem('audioEnable')

// Play sound function
export const play = async (src: Sound, force = false) => {
  try {
    if (!force && !audioEnable()) return
    document.getElementById('player') as HTMLAudioElement
    await new Audio(`/tabata/sounds/${src}.mp3`).play()
  } catch (error) {
    console.error(error)
    localStorage.removeItem('audioEnable')
  }
}

// Text to speech function
export const textToSpeech = (text: string) => {
  if (!('speechSynthesis' in window) || !audioEnable()) return
  const voiceLanguage =
    localStorage.getItem('voiceLanguage') ?? navigator.language
  const synth = new SpeechSynthesisUtterance(text)
  synth.lang = voiceLanguage
  speechSynthesis.speak(synth)
}

// Update innerHTML of element
export const updateText = (query: string, text: string) => {
  const el = document.querySelector(query)
  if (el) el.innerHTML = text
}

type Sound = 'beep' | 'tap' | 'end'
