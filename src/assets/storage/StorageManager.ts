export class StorageManager<T> {
  private key: string;
  private defaultValue: T;

  constructor(key: string, defaultValue: T) {
    this.key = key;
    this.defaultValue = defaultValue;
  }

  get(): T {
    try {
      const data = localStorage.getItem(this.key);
      if (!data) {
        localStorage.setItem(this.key, JSON.stringify(this.defaultValue));
        return this.defaultValue;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error reading from ${this.key}:`, error);
      return this.defaultValue;
    }
  }

  set(data: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to ${this.key}:`, error);
      throw error;
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error(`Error removing ${this.key}:`, error);
    }
  }

  exists(): boolean {
    return localStorage.getItem(this.key) !== null;
  }
}
