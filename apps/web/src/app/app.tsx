import './app.css';
import {
  AuthenticatedLayout,
  AuthProvider,
  FeedWorkspace,
  ProtectedRoute,
  RegistrationPage,
  SignInPage,
  WebErrorBoundary,
  WebThemeProvider,
} from '@org/ui-web';
import { RipplesApiProvider, useRipplesClientStore } from '@org/data';
import type { ReactElement } from 'react';

export function App(): ReactElement {
  const apiBaseUrl = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000/api';

  return (
    <WebErrorBoundary>
      <WebThemeProvider>
        <RipplesApiProvider apiBaseUrl={apiBaseUrl}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </RipplesApiProvider>
      </WebThemeProvider>
    </WebErrorBoundary>
  );
}

function AppContent(): ReactElement {
  const authPage = useRipplesClientStore((state) => state.authPage);
  const setAuthPage = useRipplesClientStore((state) => state.setAuthPage);

  return (
    <ProtectedRoute
      fallback={
        authPage === 'register' ? (
          <RegistrationPage onSignIn={() => setAuthPage('sign-in')} />
        ) : (
          <SignInPage onCreateAccount={() => setAuthPage('register')} />
        )
      }
    >
      <AuthenticatedLayout title="Feed workspace">
        <FeedWorkspace />
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
}

export default App;
