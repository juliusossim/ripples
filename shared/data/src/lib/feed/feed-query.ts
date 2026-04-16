import { useQuery, type QueryKey } from '@tanstack/react-query';
import { useRipplesApi } from '../api/api-provider';
import type { UseFeedQueryInput, UseFeedQueryResult } from './feed-query.types';

export const feedQueryKey = ['feed'] as const satisfies QueryKey;

export function useFeedQuery({
  accessToken,
  limit = 20,
}: Readonly<UseFeedQueryInput> = {}): UseFeedQueryResult {
  const { client } = useRipplesApi();

  return useQuery({
    queryKey: [...feedQueryKey, { limit }],
    queryFn: () => client.getFeed({ limit }, accessToken),
  });
}
