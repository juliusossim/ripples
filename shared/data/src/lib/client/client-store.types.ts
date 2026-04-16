export type AuthPage = 'register' | 'sign-in';

export interface RipplesClientState {
  readonly authPage: AuthPage;
  readonly sessionId: string;
  readonly sidebarOpen: boolean;
  readonly setAuthPage: (authPage: AuthPage) => void;
  readonly setSidebarOpen: (sidebarOpen: boolean) => void;
  readonly toggleSidebar: () => void;
}

export interface BrowserStorage {
  readonly getItem: (key: string) => string | null;
  readonly setItem: (key: string, value: string) => void;
}

export interface BrowserCrypto {
  readonly randomUUID?: () => string;
}
