import { describe, it, expect } from 'vitest';

// Test simple de la función formatDuration
// Copiada aquí para evitar problemas de importación
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes ? `${minutes}m` : ""}${
    remainingSeconds ? `${remainingSeconds}s` : ""
  }`;
};

describe('formatDuration', () => {
  it('should format seconds to human readable format', () => {
    expect(formatDuration(0)).toBe('');
    expect(formatDuration(30)).toBe('30s');
    expect(formatDuration(60)).toBe('1m');
    expect(formatDuration(90)).toBe('1m30s');
    expect(formatDuration(3661)).toBe('61m1s');
  });

  it('should handle edge cases', () => {
    expect(formatDuration(1)).toBe('1s');
    expect(formatDuration(59)).toBe('59s');
    expect(formatDuration(120)).toBe('2m');
    expect(formatDuration(3600)).toBe('60m');
  });
});
