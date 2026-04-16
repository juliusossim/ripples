import { useRipplesClientStore } from './client-store';

describe('useRipplesClientStore', () => {
  beforeEach(() => {
    useRipplesClientStore.setState({
      authPage: 'sign-in',
      sidebarOpen: false,
    });
  });

  it('stores client-only auth page state', () => {
    useRipplesClientStore.getState().setAuthPage('register');

    expect(useRipplesClientStore.getState().authPage).toBe('register');
  });

  it('toggles client-only sidebar state', () => {
    useRipplesClientStore.getState().toggleSidebar();

    expect(useRipplesClientStore.getState().sidebarOpen).toBe(true);
  });
});
