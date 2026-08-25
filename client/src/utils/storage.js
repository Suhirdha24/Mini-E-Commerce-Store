// Safe localStorage helper functions with full error handling

export const safeGetJSON = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === 'undefined' || raw === 'null') return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`[Storage] Failed to parse JSON for key "${key}", using fallback.`, err);
    return fallback;
  }
};

export const safeSetJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[Storage] Failed to save JSON for key "${key}".`, err);
  }
};

export const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[Storage] Failed to remove key "${key}".`, err);
  }
};
