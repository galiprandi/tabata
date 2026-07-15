import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';

describe('SearchBar component logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <div class="search-bar">
        <input type="text" class="search-input" />
        <button id="clear-search" style="display: none;"></button>
      </div>
    `;
    setupSearchBar();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // Re-implementation of the logic in SearchBar.astro for testing
  function setupSearchBar() {
    const searchInput = document.querySelector(".search-input") as HTMLInputElement;
    const clearButton = document.getElementById("clear-search") as HTMLButtonElement;
    let debounceTimer: any;

    const updateClearButtonVisibility = () => {
      clearButton.style.display = searchInput.value ? "inline-flex" : "none";
    };

    searchInput.addEventListener("input", (e) => {
      const query = (e.target as HTMLInputElement).value;
      updateClearButtonVisibility();

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const searchEvent = new CustomEvent("search", {
          detail: { query },
        });
        document.dispatchEvent(searchEvent);
      }, 300);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchInput.value) {
        e.preventDefault();
        clearTimeout(debounceTimer);
        searchInput.value = "";
        updateClearButtonVisibility();
        const searchEvent = new CustomEvent("search", {
          detail: { query: "" },
        });
        document.dispatchEvent(searchEvent);
      }
    });

    clearButton.addEventListener("click", async () => {
      clearTimeout(debounceTimer);
      searchInput.value = "";
      updateClearButtonVisibility();
      searchInput.focus();

      const searchEvent = new CustomEvent("search", {
        detail: { query: "" },
      });
      document.dispatchEvent(searchEvent);
    });
  }

  it('should dispatch search event on input with 300ms debounce', () => {
    const searchSpy = vi.fn();
    document.addEventListener('search', searchSpy);

    const input = document.querySelector('.search-input') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'burpees' } });

    expect(searchSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(searchSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { query: 'burpees' }
    }));
  });

  it('should clear debounce and dispatch empty search on Escape', () => {
    const searchSpy = vi.fn();
    document.addEventListener('search', searchSpy);

    const input = document.querySelector('.search-input') as HTMLInputElement;

    // Type something
    fireEvent.input(input, { target: { value: 'squats' } });

    // Press Escape before debounce finishes
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(input.value).toBe('');
    expect(searchSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { query: '' }
    }));

    // Wait more time to see if the debounced 'squats' search still fires
    vi.advanceTimersByTime(300);
    expect(searchSpy).toHaveBeenCalledTimes(1); // Only the empty search from Escape
    expect(searchSpy).not.toHaveBeenCalledWith(expect.objectContaining({
      detail: { query: 'squats' }
    }));
  });

  it('should clear debounce and dispatch empty search on clear button click', () => {
    const searchSpy = vi.fn();
    document.addEventListener('search', searchSpy);

    const input = document.querySelector('.search-input') as HTMLInputElement;
    const clearBtn = document.getElementById('clear-search') as HTMLButtonElement;

    // Type something
    fireEvent.input(input, { target: { value: 'plank' } });

    // Click clear button before debounce finishes
    fireEvent.click(clearBtn);

    expect(input.value).toBe('');
    expect(searchSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { query: '' }
    }));

    // Wait more time
    vi.advanceTimersByTime(300);
    expect(searchSpy).toHaveBeenCalledTimes(1);
    expect(searchSpy).not.toHaveBeenCalledWith(expect.objectContaining({
      detail: { query: 'plank' }
    }));
  });

  it('should show/hide clear button based on input value', () => {
    const input = document.querySelector('.search-input') as HTMLInputElement;
    const clearBtn = document.getElementById('clear-search') as HTMLButtonElement;

    expect(clearBtn.style.display).toBe('none');

    fireEvent.input(input, { target: { value: 'a' } });
    expect(clearBtn.style.display).toBe('inline-flex');

    fireEvent.input(input, { target: { value: '' } });
    expect(clearBtn.style.display).toBe('none');
  });
});
