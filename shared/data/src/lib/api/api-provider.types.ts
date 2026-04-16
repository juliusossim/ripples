import type { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { RipplesApiClient } from '@org/api-client';

export interface RipplesApiContextValue {
  readonly client: RipplesApiClient;
  readonly queryClient: QueryClient;
}

export interface RipplesApiProviderProps {
  readonly apiBaseUrl?: string;
  readonly children: ReactNode;
  readonly client?: RipplesApiClient;
  readonly queryClient?: QueryClient;
}
