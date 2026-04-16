import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from 'react';
import {
  applyWebTheme,
  darkThemeMediaQuery,
  readWebThemePreference,
  resolveWebTheme,
  webThemeStorageKey,
  writeWebThemePreference,
} from '../utils/web-theme-utils';
import type {
  WebTheme,
  WebThemeContextValue,
  WebThemePreference,
  WebThemeProviderProps,
} from '../web-theme.types';

const WebThemeContext = createContext<WebThemeContextValue | undefined>(undefined);

export function WebThemeProvider({
  children,
  defaultPreference = 'system',
  storageKey = webThemeStorageKey,
}: Readonly<WebThemeProviderProps>): ReactElement {
  const [preference, setPreferenceState] = useState<WebThemePreference>(() =>
    readWebThemePreference(storageKey, defaultPreference),
  );
  const [theme, setTheme] = useState<WebTheme>(() => resolveWebTheme(preference));

  useEffect(() => {
    function syncTheme(): void {
      const resolvedTheme = resolveWebTheme(preference);
      setTheme(resolvedTheme);
      applyWebTheme(resolvedTheme);
    }

    syncTheme();
    if (preference !== 'system' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const media = window.matchMedia(darkThemeMediaQuery);
    media.addEventListener('change', syncTheme);
    return () => media.removeEventListener('change', syncTheme);
  }, [preference]);

  const setPreference = useCallback(
    (nextPreference: WebThemePreference): void => {
      writeWebThemePreference(nextPreference, storageKey);
      setPreferenceState(nextPreference);
    },
    [storageKey],
  );

  const value = useMemo<WebThemeContextValue>(
    () => ({ preference, setPreference, theme }),
    [preference, setPreference, theme],
  );

  return <WebThemeContext.Provider value={value}>{children}</WebThemeContext.Provider>;
}

export function useWebTheme(): WebThemeContextValue {
  const value = useContext(WebThemeContext);
  if (!value) {
    throw new Error('useWebTheme must be used inside WebThemeProvider.');
  }

  return value;
}
