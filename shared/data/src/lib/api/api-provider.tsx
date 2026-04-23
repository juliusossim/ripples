import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
  type QueryKey,
} from '@tanstack/react-query';
import { createContext, useContext, useMemo, type ReactElement } from 'react';
import { createRipplesApiClient } from '@org/api-client';
import type { RipplesApiContextValue, RipplesApiProviderProps } from './api-provider.types';

export const authUserQueryKey = ['auth', 'me'] as const satisfies QueryKey;
const defaultApiBaseUrl = 'http://localhost:3000/api';

const RipplesApiContext = createContext<RipplesApiContextValue | undefined>(undefined);

export function createRipplesQueryClient(config: QueryClientConfig = {}): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 30_000,
        ...config.defaultOptions?.queries,
      },
      mutations: {
        retry: 0,
        ...config.defaultOptions?.mutations,
      },
    },
    ...config,
  });
}

export function RipplesApiProvider({
  apiBaseUrl,
  children,
  client: providedClient,
  queryClient: providedQueryClient,
}: Readonly<RipplesApiProviderProps>): ReactElement {
  const resolvedApiBaseUrl = apiBaseUrl ?? defaultApiBaseUrl;
  const client = useMemo(
    () => providedClient ?? createRipplesApiClient({ baseUrl: resolvedApiBaseUrl }),
    [providedClient, resolvedApiBaseUrl],
  );
  const queryClient = useMemo(
    () => providedQueryClient ?? createRipplesQueryClient(),
    [providedQueryClient],
  );
  const value = useMemo<RipplesApiContextValue>(
    () => ({ apiBaseUrl: resolvedApiBaseUrl, client, queryClient }),
    [client, queryClient, resolvedApiBaseUrl],
  );

  return (
    <RipplesApiContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RipplesApiContext.Provider>
  );
}

export function useRipplesApi(): RipplesApiContextValue {
  const value = useContext(RipplesApiContext);
  if (!value) {
    throw new Error('useRipplesApi must be used inside RipplesApiProvider.');
  }

  return value;
}

export function useOptionalRipplesApi(): RipplesApiContextValue | undefined {
  return useContext(RipplesApiContext);
}
