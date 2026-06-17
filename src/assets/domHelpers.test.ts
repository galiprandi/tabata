import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatDuration,
  switchBodyClass,
  getClasses,
  getBodyClasses,
  hasClass,
  onClick,
  speechOnTap,
} from './domHelpers';
import { textToSpeech } from './main';

// Mock textToSpeech
vi.mock('./main', () => ({
  textToSpeech: vi.fn(),
}));

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

describe('switchBodyClass', () => {
  beforeEach(() => {
    document.body.className = '';
  });

  it('should set the class name on body', () => {
    switchBodyClass('test-class');
    expect(document.body.className).toBe('test-class');
  });

  it('should handle empty class name', () => {
    switchBodyClass('');
    expect(document.body.className).toBe('');
  });

  it('should handle multiple classes', () => {
    switchBodyClass('class1 class2 class3');
    expect(document.body.className).toBe('class1 class2 class3');
  });
});

describe('getClasses', () => {
  it('should return array of classes from element', () => {
    const div = document.createElement('div');
    div.className = 'class1 class2 class3';
    const classes = getClasses(div);
    expect(classes).toEqual(['class1', 'class2', 'class3']);
  });

  it('should return empty array for element with no classes', () => {
    const div = document.createElement('div');
    const classes = getClasses(div);
    expect(classes).toEqual([]);
  });

  it('should handle single class', () => {
    const div = document.createElement('div');
    div.className = 'single-class';
    const classes = getClasses(div);
    expect(classes).toEqual(['single-class']);
  });
});

describe('getBodyClasses', () => {
  beforeEach(() => {
    document.body.className = '';
  });

  it('should return array of classes from body', () => {
    document.body.className = 'body-class1 body-class2';
    const classes = getBodyClasses();
    expect(classes).toEqual(['body-class1', 'body-class2']);
  });

  it('should return empty array when body has no classes', () => {
    const classes = getBodyClasses();
    expect(classes).toEqual([]);
  });
});

describe('hasClass', () => {
  it('should return true if element has the class', () => {
    const div = document.createElement('div');
    div.className = 'class1 class2 class3';
    expect(hasClass(div, 'class2')).toBe(true);
  });

  it('should return false if element does not have the class', () => {
    const div = document.createElement('div');
    div.className = 'class1 class2';
    expect(hasClass(div, 'class3')).toBe(false);
  });

  it('should return false for element with no classes', () => {
    const div = document.createElement('div');
    expect(hasClass(div, 'any-class')).toBe(false);
  });
});

describe('onClick', () => {
  it('should add click event listener to matching elements', () => {
    const callback = vi.fn();
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    div1.className = 'test-class';
    div2.className = 'test-class';
    document.body.appendChild(div1);
    document.body.appendChild(div2);

    onClick('.test-class', callback);

    div1.click();
    div2.click();

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not add listener if no elements match', () => {
    const callback = vi.fn();
    onClick('.non-existent-class', callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle single element', () => {
    const callback = vi.fn();
    const div = document.createElement('div');
    div.className = 'single-element';
    document.body.appendChild(div);

    onClick('.single-element', callback);

    div.click();

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('speechOnTap', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('should add click listeners to all speech elements', () => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    div1.className = 'speech';
    div2.className = 'speech';
    div1.textContent = 'Hello';
    div2.textContent = 'World';
    document.body.appendChild(div1);
    document.body.appendChild(div2);

    speechOnTap();

    div1.click();
    div2.click();

    expect(textToSpeech).toHaveBeenCalledWith('Hello');
    expect(textToSpeech).toHaveBeenCalledWith('World');
  });

  it('should handle empty text content', () => {
    const div = document.createElement('div');
    div.className = 'speech';
    div.textContent = '';
    document.body.appendChild(div);

    speechOnTap();

    div.click();

    expect(textToSpeech).toHaveBeenCalledWith('');
  });

  it('should not throw when no speech elements exist', () => {
    expect(() => speechOnTap()).not.toThrow();
  });
});
