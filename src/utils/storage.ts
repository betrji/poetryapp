import type { StorageManager } from '../types';

export const createStorageManager = (storage: Storage = localStorage): StorageManager => ({
  getItem: (key: string) => {
    try {
      return storage.getItem(key);
    } catch (e) {
      console.error(`Error reading from storage:`, e);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      storage.setItem(key, value);
    } catch (e) {
      console.error(`Error writing to storage:`, e);
    }
  },
  removeItem: (key: string) => {
    try {
      storage.removeItem(key);
    } catch (e) {
      console.error(`Error removing from storage:`, e);
    }
  }
});

export const storageManager = createStorageManager();