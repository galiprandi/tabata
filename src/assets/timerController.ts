/**
 * TimerController - Manages workout timer with pause/resume support
 * Replaces the old delaySeconds() approach that used window.timer (single timeout)
 * with a cancellable, pausable system using AbortController.
 */

export class TimerController {
  private aborted = false
  private paused = false
  private pauseResolve: (() => void) | null = null

  /** Abort all pending delays */
  abort() {
    this.aborted = true
    if (this.pauseResolve) {
      this.pauseResolve()
      this.pauseResolve = null
    }
  }

  /** Pause the timer - resolves current delay but doesn't advance */
  pause() {
    this.paused = true
  }

  /** Resume from pause */
  resume() {
    this.paused = false
    if (this.pauseResolve) {
      this.pauseResolve()
      this.pauseResolve = null
    }
  }

  get isPaused() {
    return this.paused
  }

  get isAborted() {
    return this.aborted
  }

  /**
   * Wait for pause to be released. Returns immediately if not paused.
   */
  private waitForResume(): Promise<void> {
    if (!this.paused) return Promise.resolve()
    return new Promise((resolve) => {
      this.pauseResolve = resolve
    })
  }

  /**
   * Delay that respects pause and abort states.
   * If aborted, throws immediately to break out of loops.
   * If paused, waits until resumed before continuing.
   */
  async delay(seconds: number): Promise<void> {
    const totalMs = seconds * 1000
    const start = Date.now()
    let elapsed = 0

    while (elapsed < totalMs) {
      if (this.aborted) {
        throw new Error('TIMER_ABORTED')
      }

      if (this.paused) {
        await this.waitForResume()
        if (this.aborted) {
          throw new Error('TIMER_ABORTED')
        }
        // Don't count paused time
        continue
      }

      const remaining = totalMs - elapsed
      const step = Math.min(remaining, 100) // 100ms granularity

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          clearTimeout(timeout)
          resolve()
        }, step)

        // Check abort periodically
        if (this.aborted) {
          clearTimeout(timeout)
          reject(new Error('TIMER_ABORTED'))
        }
      })

      elapsed = Date.now() - start
    }
  }

  /** Reset to initial state for reuse */
  reset() {
    this.aborted = false
    this.paused = false
    this.pauseResolve = null
  }
}

/** Vibrate the device if supported */
export function hapticFeedback(pattern: number | number[] = 50) {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  } catch (e) {
    // Silently ignore
  }
}
