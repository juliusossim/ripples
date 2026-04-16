import type { WebTheme, WebThemePreference } from '../web-theme.types';

export const darkThemeMediaQuery = '(prefers-color-scheme: dark)';
export const webThemeStorageKey = 'ripples:web-theme';

const webThemePreferences = new Set<string>(['dark', 'light', 'system']);

export function isWebThemePreference(value: string | null): value is WebThemePreference {
  return value !== null && webThemePreferences.has(value);
}

export function getSystemWebTheme(): WebTheme {
  if (!canUseDom() || typeof globalThis.matchMedia !== 'function') {
    return 'light';
  }

  return globalThis.matchMedia(darkThemeMediaQuery).matches ? 'dark' : 'light';
}

export function resolveWebTheme(preference: WebThemePreference): WebTheme {
  return preference === 'system' ? getSystemWebTheme() : preference;
}

export function applyWebTheme(theme: WebTheme): void {
  if (!canUseDom()) {
    return;
  }

  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
}

export function readWebThemePreference(
  storageKey: string = webThemeStorageKey,
  fallback: WebThemePreference = 'system',
): WebThemePreference {
  if (!canUseDom()) {
    return fallback;
  }

  try {
    const storedPreference = globalThis.localStorage.getItem(storageKey);
    return isWebThemePreference(storedPreference) ? storedPreference : fallback;
  } catch {
    return fallback;
  }
}

export function writeWebThemePreference(
  preference: WebThemePreference,
  storageKey: string = webThemeStorageKey,
): void {
  if (!canUseDom()) {
    return;
  }

  try {
    globalThis.localStorage.setItem(storageKey, preference);
  } catch {
    // Storage can be unavailable in private browsing or strict test sandboxes.
  }
}

export function applyInitialWebTheme(): void {
  applyWebTheme(resolveWebTheme(readWebThemePreference()));
}

function canUseDom(): boolean {
  return typeof globalThis !== 'undefined' && typeof document !== 'undefined';
}
