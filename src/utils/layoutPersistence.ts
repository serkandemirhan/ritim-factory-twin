import type { FactoryLayoutSnapshot } from "../types/factory";

const STORAGE_KEY = "ritim-factory-twin-layout";

export function saveLayoutSnapshot(snapshot: FactoryLayoutSnapshot): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function loadLayoutSnapshot(): FactoryLayoutSnapshot | null {
  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as FactoryLayoutSnapshot;

    if (parsed.version !== 1 || !Array.isArray(parsed.objects)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
