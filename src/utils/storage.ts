/**
 * MySpendTracker — AsyncStorage Wrapper (v3 API)
 * ----------------------------------------------
 * Typed, safe wrapper with JSON serialization + error handling.
 * Compatible with @react-native-async-storage/async-storage v3+
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────
// 1. BASIC OPERATIONS
// ─────────────────────────────────────────────

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (error) {
    console.warn(`[storage] Failed to set "${key}":`, error);
  }
}

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    if (json === null) return null;
    return JSON.parse(json) as T;
  } catch (error) {
    console.warn(`[storage] Failed to get "${key}":`, error);
    return null;
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] Failed to remove "${key}":`, error);
  }
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.warn('[storage] Failed to clear all:', error);
  }
}

// ─────────────────────────────────────────────
// 2. BATCH OPERATIONS (v3 API)
// ─────────────────────────────────────────────

/**
 * Get multiple values. v3 returns a Record<string, string | null>.
 */
export async function getMultiple<T>(
  keys: string[],
): Promise<Record<string, T | null>> {
  try {
    const raw = await AsyncStorage.getMany(keys);

    const result: Record<string, T | null> = {};
    for (const key of keys) {
      const value = raw[key];
      result[key] = value ? (JSON.parse(value) as T) : null;
    }
    return result;
  } catch (error) {
    console.warn('[storage] Failed to get multiple:', error);
    return {};
  }
}

/**
 * Set multiple values. v3 expects a Record<string, string>.
 */
export async function setMultiple(entries: [string, unknown][]): Promise<void> {
  try {
    const record: Record<string, string> = {};
    for (const [key, value] of entries) {
      record[key] = JSON.stringify(value);
    }
    await AsyncStorage.setMany(record);
  } catch (error) {
    console.warn('[storage] Failed to set multiple:', error);
  }
}

/**
 * Remove multiple keys at once.
 */
export async function removeMultiple(keys: string[]): Promise<void> {
  try {
    await AsyncStorage.removeMany(keys);
  } catch (error) {
    console.warn('[storage] Failed to remove multiple:', error);
  }
}

// ─────────────────────────────────────────────
// 3. QUERY HELPERS
// ─────────────────────────────────────────────

export async function getAllKeys(): Promise<string[]> {
  try {
    return (await AsyncStorage.getAllKeys()) as string[];
  } catch (error) {
    console.warn('[storage] Failed to get keys:', error);
    return [];
  }
}

export async function hasItem(key: string): Promise<boolean> {
  const keys = await getAllKeys();
  return keys.includes(key);
}

export async function getStorageSize(): Promise<number> {
  try {
    const keys = await getAllKeys();
    let total = 0;
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      total += (key.length + (value?.length ?? 0)) * 2;
    }
    return total;
  } catch {
    return 0;
  }
}

// ─────────────────────────────────────────────
// 4. NAMESPACED STORAGE
// ─────────────────────────────────────────────

export function createNamespacedStorage(namespace: string) {
  const ns = (key: string) => `${namespace}:${key}`;

  return {
    set: <T>(key: string, value: T) => setItem(ns(key), value),
    get: <T>(key: string) => getItem<T>(ns(key)),
    remove: (key: string) => removeItem(ns(key)),
  };
}
