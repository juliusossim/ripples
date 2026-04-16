import { create } from 'zustand';
import type { BrowserCrypto, BrowserStorage, RipplesClientState } from './client-store.types';

const sessionStorageKey = 'ripples:session-id';

export const useRipplesClientStore = create<RipplesClientState>((set) => ({
  authPage: 'sign-in',
  sessionId: readSessionId(),
  sidebarOpen: false,
  setAuthPage: (authPage) => set({ authPage }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

function readSessionId(): string {
  const storage = readLocalStorage();
  if (!storage) {
    return createSessionId();
  }

  try {
    const existingSessionId = storage.getItem(sessionStorageKey);
    if (existingSessionId) {
      return existingSessionId;
    }

    const nextSessionId = createSessionId();
    storage.setItem(sessionStorageKey, nextSessionId);
    return nextSessionId;
  } catch {
    return createSessionId();
  }
}

function createSessionId(): string {
  const crypto = (globalThis as { readonly crypto?: BrowserCrypto }).crypto;

  return crypto?.randomUUID?.() ?? `session-${Date.now()}`;
}

function readLocalStorage(): BrowserStorage | undefined {
  return (globalThis as { readonly localStorage?: BrowserStorage }).localStorage;
}
