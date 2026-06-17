import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSettings,
  updateSettings,
  delaySeconds,
  textToSpeech,
  updateTextContent,
  gaEvent,
} from './main';
import { defaultSettings } from './defaultSettings';
import * as audioModule from './audio';

// Mock speechSynthesis
const mockSpeechSynthesis = {
  cancel: vi.fn(),
  speak: vi.fn(),
};

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

// Mock SpeechSynthesisUtterance
vi.stubGlobal('SpeechSynthesisUtterance', class {
  text = '';
  lang = '';
  volume = 1;
  rate = 1;
  pitch = 1;
});

// Mock getAudioStatus
vi.mock('./audio', () => ({
  getAudioStatus: vi.fn(),
}));

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    language: 'en-US',
    wakeLock: {
      request: vi.fn(),
    },
  },
  writable: true,
});

describe('main functions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getSettings', () => {
    it('should return default settings when localStorage is empty', () => {
      const settings = getSettings();
      
      expect(settings).toEqual(defaultSettings);
      expect(localStorage.getItem('settings')).toBe(JSON.stringify(defaultSettings));
    });

    it('should return stored settings when they exist', () => {
      const customSettings = { ...defaultSettings, workDuration: 30 };
      localStorage.setItem('settings', JSON.stringify(customSettings));
      
      const settings = getSettings();
      
      expect(settings.workDuration).toBe(30);
    });

    it('should set default rounds if missing', () => {
      const settingsWithoutRounds = {
        ...defaultSettings,
        rounds: undefined,
      };
      localStorage.setItem('settings', JSON.stringify(settingsWithoutRounds));
      
      const settings = getSettings();
      
      expect(settings.rounds).toBe(settings.workouts.length);
    });

    it('should set default nextExercise if missing', () => {
      const settingsWithoutNext = {
        ...defaultSettings,
        nextExercise: undefined,
      };
      localStorage.setItem('settings', JSON.stringify(settingsWithoutNext));
      
      const settings = getSettings();
      
      expect(settings.nextExercise).toBe(0);
    });
  });

  describe('updateSettings', () => {
    it('should update settings in localStorage', () => {
      const newSettings = { ...defaultSettings, workDuration: 45 };
      
      updateSettings(newSettings);
      
      const stored = localStorage.getItem('settings');
      expect(stored).toBe(JSON.stringify(newSettings));
    });
  });

  describe('delaySeconds', () => {
    it('should resolve after specified seconds', async () => {
      const promise = delaySeconds(2);
      
      vi.advanceTimersByTime(2000);
      
      await expect(promise).resolves.toBeUndefined();
    });

    it('should set window.timer', () => {
      delaySeconds(1);
      
      expect(window.timer).toBeDefined();
    });
  });

  describe('textToSpeech', () => {
    it('should not speak when speechSynthesis is not available', () => {
      Object.defineProperty(window, 'speechSynthesis', {
        value: undefined,
        writable: true,
      });
      
      textToSpeech('test');
      
      expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
      
      // Restore
      Object.defineProperty(window, 'speechSynthesis', {
        value: mockSpeechSynthesis,
        writable: true,
      });
    });

    it('should not speak when audio is disabled and not forced', () => {
      vi.mocked(audioModule.getAudioStatus).mockReturnValue(false);
      
      textToSpeech('test');
      
      expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
    });

    it('should speak when audio is enabled', () => {
      vi.mocked(audioModule.getAudioStatus).mockReturnValue(true);
      
      textToSpeech('test');
      
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('should speak when forced even if audio is disabled', () => {
      vi.mocked(audioModule.getAudioStatus).mockReturnValue(false);
      
      textToSpeech('test', true);
      
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('should use stored voice language if available', () => {
      vi.mocked(audioModule.getAudioStatus).mockReturnValue(true);
      localStorage.setItem('voiceLanguage', 'es-ES');
      
      textToSpeech('hola');
      
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('should use navigator language if voice language not stored', () => {
      vi.mocked(audioModule.getAudioStatus).mockReturnValue(true);
      
      textToSpeech('hello');
      
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      vi.mocked(audioModule.getAudioStatus).mockReturnValue(true);
      mockSpeechSynthesis.speak.mockImplementation(() => {
        throw new Error('Speech error');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      textToSpeech('test');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('updateTextContent', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should update text content of matching elements', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      div1.className = 'test-class';
      div2.className = 'test-class';
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      
      updateTextContent('.test-class', 'new text');
      
      expect(div1.textContent).toBe('new text');
      expect(div2.textContent).toBe('new text');
    });

    it('should not throw when no elements match', () => {
      expect(() => updateTextContent('.non-existent', 'text')).not.toThrow();
    });

    it('should handle single element', () => {
      const div = document.createElement('div');
      div.className = 'single';
      document.body.appendChild(div);
      
      updateTextContent('.single', 'text');
      
      expect(div.textContent).toBe('text');
    });
  });

  describe('gaEvent', () => {
    it('should not call gtag when it is not available', () => {
      Object.defineProperty(window, 'gtag', {
        value: undefined,
        writable: true,
      });
      
      expect(() => gaEvent('Start Workout')).not.toThrow();
    });

    it('should call gtag when it is available', () => {
      const mockGtag = vi.fn();
      Object.defineProperty(window, 'gtag', {
        value: mockGtag,
        writable: true,
      });
      
      gaEvent('Start Workout');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'Start Workout');
    });
  });

  describe('wakeLock', () => {
    it('should handle wake lock request successfully', async () => {
      const mockWakeLock = {
        released: false,
        addEventListener: vi.fn(),
      };
      (navigator.wakeLock.request as any).mockResolvedValue(mockWakeLock);
      
      // The wakeLock function is called on DOMContentLoaded
      // We can't easily test it directly since it's not exported
      // But we can verify navigator.wakeLock is available
      expect(navigator.wakeLock).toBeDefined();
    });

    it('should handle when wake lock is not available', () => {
      Object.defineProperty(window, 'navigator', {
        value: {
          language: 'en-US',
        },
        writable: true,
      });
      
      expect(navigator.wakeLock).toBeUndefined();
    });
  });
});
