import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { WebThemeProvider } from './web-theme-provider';

const mediaListeners = new Set<EventListener>();
let systemPrefersDark = false;

describe('WebThemeProvider', () => {
  beforeEach(() => {
    systemPrefersDark = false;
    mediaListeners.clear();
    window.localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('style');
    vi.stubGlobal('matchMedia', createMatchMediaStub());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('applies the system dark theme when the browser prefers dark mode', async () => {
    systemPrefersDark = true;

    render(
      <WebThemeProvider>
        <p>Ripples</p>
      </WebThemeProvider>,
    );

    await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(true));
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('updates when the system color scheme changes', async () => {
    render(
      <WebThemeProvider>
        <p>Ripples</p>
      </WebThemeProvider>,
    );

    systemPrefersDark = true;
    act(() => {
      const changeEvent = new Event('change');
      mediaListeners.forEach((listener) => listener(changeEvent));
    });

    await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(true));
  });
});

function createMatchMediaStub(): (query: string) => MediaQueryList {
  return (query: string): MediaQueryList =>
    ({
      addEventListener: (_event: string, listener: EventListenerOrEventListenerObject | null) => {
        if (typeof listener === 'function') {
          mediaListeners.add(listener);
        }
      },
      addListener: (listener: EventListener | null) => {
        if (listener) {
          mediaListeners.add(listener);
        }
      },
      dispatchEvent: () => true,
      matches: query.includes('dark') && systemPrefersDark,
      media: query,
      onchange: null,
      removeEventListener: (
        _event: string,
        listener: EventListenerOrEventListenerObject | null,
      ) => {
        if (typeof listener === 'function') {
          mediaListeners.delete(listener);
        }
      },
      removeListener: (listener: EventListener | null) => {
        if (listener) {
          mediaListeners.delete(listener);
        }
      },
    }) as unknown as MediaQueryList;
}
