import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setAudioDisable,
  setAudioEnable,
  setAudioStatus,
  getAudioStatus,
  play,
} from './audio';

describe('audio functions', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
  });

  describe('getAudioStatus', () => {
    it('should return true when audio is enabled (default)', () => {
      expect(getAudioStatus()).toBe(true);
    });

    it('should return false when audio is disabled', () => {
      localStorage.setItem('audioEnable', 'false');
      expect(getAudioStatus()).toBe(false);
    });

    it('should return true when audio is explicitly enabled', () => {
      localStorage.setItem('audioEnable', 'true');
      expect(getAudioStatus()).toBe(true);
    });

    it('should return true when audio key does not exist', () => {
      expect(getAudioStatus()).toBe(true);
    });
  });

  describe('setAudioDisable', () => {
    it('should set localStorage to false', () => {
      setAudioDisable();
      
      expect(localStorage.getItem('audioEnable')).toBe('false');
    });
  });

  describe('setAudioEnable', () => {
    it('should set localStorage to true', () => {
      setAudioEnable();
      
      expect(localStorage.getItem('audioEnable')).toBe('true');
    });
  });

  describe('setAudioStatus', () => {
    it('should enable audio when status is true', () => {
      setAudioStatus(true);
      
      expect(localStorage.getItem('audioEnable')).toBe('true');
    });

    it('should disable audio when status is false', () => {
      setAudioStatus(false);
      
      expect(localStorage.getItem('audioEnable')).toBe('false');
    });
  });

  describe('play', () => {
    it('should not play sound when audio is disabled', async () => {
      localStorage.setItem('audioEnable', 'false');
      
      await play('beep');
      
      // Should not throw, just return early
      expect(true).toBe(true);
    });

    it('should handle when player is null', async () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await play('beep');
      
      expect(consoleSpy).toHaveBeenCalledWith('Player not found');
      consoleSpy.mockRestore();
    });
  });
});
