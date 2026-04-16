import type { ReactNode } from 'react';

export type WebTheme = 'dark' | 'light';
export type WebThemePreference = WebTheme | 'system';

export interface WebThemeContextValue {
  readonly preference: WebThemePreference;
  readonly setPreference: (preference: WebThemePreference) => void;
  readonly theme: WebTheme;
}

export interface WebThemeProviderProps {
  readonly children: ReactNode;
  readonly defaultPreference?: WebThemePreference;
  readonly storageKey?: string;
}
