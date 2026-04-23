import type {
  AuthResponse,
  AuthUser,
  FeedResponse,
  GoogleOAuthStartResponse,
  Property,
  PropertyInteractionResponse,
  UploadedMediaAsset,
} from '@org/types';
import type {
  FeedRequestOptions,
  RipplesApiClient,
  RipplesApiClientOptions,
} from './api-client.types.js';

export type { FeedRequestOptions, RipplesApiClient, RipplesApiClientOptions };

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export function createRipplesApiClient(options: RipplesApiClientOptions = {}): RipplesApiClient {
  const baseUrl = normalizeBaseUrl(options.baseUrl ?? 'http://localhost:3000/api');
  const fetcher = options.fetcher ?? fetch;

  return {
    registerManual: (input) => request<AuthResponse>(fetcher, baseUrl, '/auth/register', input),
    loginManual: (input) => request<AuthResponse>(fetcher, baseUrl, '/auth/login', input),
    refresh: (input = {}) => request<AuthResponse>(fetcher, baseUrl, '/auth/refresh', input),
    logout: (input = {}) => request<{ success: true }>(fetcher, baseUrl, '/auth/logout', input),
    startGoogleOAuth: (input) =>
      request<GoogleOAuthStartResponse>(fetcher, baseUrl, '/auth/oauth/google/start', input),
    completeGoogleOAuth: (input) =>
      request<AuthResponse>(fetcher, baseUrl, '/auth/oauth/google/callback', input),
    getMe: (accessToken) =>
      request<AuthUser>(fetcher, baseUrl, '/auth/me', undefined, {
        authorization: `Bearer ${accessToken}`,
      }),
    createProperty: (input, accessToken) =>
      request<Property>(fetcher, baseUrl, '/properties', input, authorizationHeader(accessToken)),
    uploadMedia: (files, accessToken) =>
      requestFormData<UploadedMediaAsset[]>(
        fetcher,
        baseUrl,
        '/media/uploads',
        createUploadFormData(files),
        authorizationHeader(accessToken),
      ),
    getProperties: (accessToken) =>
      request<Property[]>(
        fetcher,
        baseUrl,
        '/properties',
        undefined,
        authorizationHeader(accessToken),
      ),
    getFeed: (input, accessToken) =>
      request<FeedResponse>(
        fetcher,
        baseUrl,
        createFeedPath(input),
        undefined,
        authorizationHeader(accessToken),
      ),
    viewProperty: (propertyId, input, accessToken) =>
      request<PropertyInteractionResponse>(
        fetcher,
        baseUrl,
        `/properties/${encodeURIComponent(propertyId)}/view`,
        input,
        authorizationHeader(accessToken),
      ),
    likeProperty: (propertyId, input, accessToken) =>
      request<PropertyInteractionResponse>(
        fetcher,
        baseUrl,
        `/properties/${encodeURIComponent(propertyId)}/like`,
        input,
        authorizationHeader(accessToken),
      ),
    saveProperty: (propertyId, input, accessToken) =>
      request<PropertyInteractionResponse>(
        fetcher,
        baseUrl,
        `/properties/${encodeURIComponent(propertyId)}/save`,
        input,
        authorizationHeader(accessToken),
      ),
    shareProperty: (propertyId, input, accessToken) =>
      request<PropertyInteractionResponse>(
        fetcher,
        baseUrl,
        `/properties/${encodeURIComponent(propertyId)}/share`,
        input,
        authorizationHeader(accessToken),
      ),
  };
}

async function request<TResponse>(
  fetcher: typeof fetch,
  baseUrl: string,
  path: string,
  body?: object,
  headers: Record<string, string> = {},
): Promise<TResponse> {
  const response = await fetcher(`${baseUrl}${path}`, {
    method: body ? 'POST' : 'GET',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new ApiClientError(readErrorMessage(payload), response.status, payload);
  }

  return payload as TResponse;
}

async function requestFormData<TResponse>(
  fetcher: typeof fetch,
  baseUrl: string,
  path: string,
  body: FormData,
  headers: Record<string, string> = {},
): Promise<TResponse> {
  const response = await fetcher(`${baseUrl}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      ...headers,
    },
    body,
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new ApiClientError(readErrorMessage(payload), response.status, payload);
  }

  return payload as TResponse;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  return JSON.parse(text) as unknown;
}

function readErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'Request failed.';
  }
  const message = (payload as Record<string, unknown>).message;
  if (Array.isArray(message)) {
    return message.filter((item): item is string => typeof item === 'string').join(' ');
  }

  return typeof message === 'string' ? message : 'Request failed.';
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

function authorizationHeader(accessToken?: string): Record<string, string> {
  return accessToken ? { authorization: `Bearer ${accessToken}` } : {};
}

function createFeedPath(input?: FeedRequestOptions): string {
  const params = new URLSearchParams();
  if (input?.limit) {
    params.set('limit', String(input.limit));
  }
  if (input?.cursor) {
    params.set('cursor', input.cursor);
  }
  const query = params.toString();

  return query ? `/feed?${query}` : '/feed';
}

function createUploadFormData(files: File[]): FormData {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  return formData;
}
