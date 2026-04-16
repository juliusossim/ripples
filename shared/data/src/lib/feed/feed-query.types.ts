import type { UseQueryResult } from '@tanstack/react-query';
import type { FeedResponse } from '@org/types';

export interface UseFeedQueryInput {
  readonly accessToken?: string;
  readonly limit?: number;
}

export type UseFeedQueryResult = UseQueryResult<FeedResponse, Error>;
