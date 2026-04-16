import { createRipplesApiClient, type ApiClientError } from './api-client.js';

describe('createRipplesApiClient', () => {
  it('posts manual registration requests to the auth API', async () => {
    const fetcher = createFetcher(authResponse());
    const client = createRipplesApiClient({
      baseUrl: 'http://localhost:3000/api/',
      fetcher,
    });

    await client.registerManual({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'correct-horse-battery',
    });

    expect(fetcher).toHaveBeenCalledWith('http://localhost:3000/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'correct-horse-battery',
      }),
    });
  });

  it('posts manual login requests to the auth API', async () => {
    const fetcher = createFetcher(authResponse());
    const client = createRipplesApiClient({ fetcher });

    await expect(
      client.loginManual({
        email: 'ada@example.com',
        password: 'Correct1!',
      }),
    ).resolves.toEqual(authResponse());

    expect(fetcher).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/login',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('uses the refresh cookie when no refresh body is provided', async () => {
    const fetcher = createFetcher(authResponse());
    const client = createRipplesApiClient({ fetcher });

    await client.refresh();

    expect(fetcher).toHaveBeenCalledWith('http://localhost:3000/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({}),
    });
  });

  it('posts logout requests with an empty default body', async () => {
    const fetcher = createFetcher({ success: true });
    const client = createRipplesApiClient({ fetcher });

    await expect(client.logout()).resolves.toEqual({ success: true });

    expect(fetcher).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/logout',
      expect.objectContaining({ body: JSON.stringify({}) }),
    );
  });

  it('starts and completes Google OAuth requests', async () => {
    const fetcher = createFetcher({
      authorizationUrl: 'https://accounts.google.com',
      state: 'state',
    })
      .mockResolvedValueOnce(
        jsonResponse({ authorizationUrl: 'https://accounts.google.com', state: 'state' }),
      )
      .mockResolvedValueOnce(jsonResponse(authResponse()));
    const client = createRipplesApiClient({ fetcher });

    await expect(
      client.startGoogleOAuth({ redirectUri: 'http://localhost/auth/google' }),
    ).resolves.toEqual({
      authorizationUrl: 'https://accounts.google.com',
      state: 'state',
    });
    await expect(
      client.completeGoogleOAuth({
        code: 'code',
        state: 'state',
        redirectUri: 'http://localhost/auth/google',
      }),
    ).resolves.toEqual(authResponse());

    expect(fetcher).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3000/api/auth/oauth/google/start',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3000/api/auth/oauth/google/callback',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('loads the current user with bearer authorization', async () => {
    const user = authResponse().user;
    const fetcher = createFetcher(user);
    const client = createRipplesApiClient({ fetcher });

    await expect(client.getMe('access-token')).resolves.toEqual(user);

    expect(fetcher).toHaveBeenCalledWith('http://localhost:3000/api/auth/me', {
      method: 'GET',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer access-token',
      },
      body: undefined,
    });
  });

  it('creates properties with bearer authorization', async () => {
    const fetcher = createFetcher(propertyResponse());
    const client = createRipplesApiClient({ fetcher });

    await client.createProperty(createPropertyRequest(), 'access-token');

    expect(fetcher).toHaveBeenCalledWith('http://localhost:3000/api/properties', {
      method: 'POST',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer access-token',
        'content-type': 'application/json',
      },
      body: JSON.stringify(createPropertyRequest()),
    });
  });

  it('loads the ranked feed with query parameters', async () => {
    const fetcher = createFetcher({ items: [], nextCursor: '20' });
    const client = createRipplesApiClient({ fetcher });

    await client.getFeed({ limit: 10, cursor: '5' }, 'access-token');

    expect(fetcher).toHaveBeenCalledWith('http://localhost:3000/api/feed?limit=10&cursor=5', {
      method: 'GET',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer access-token',
      },
      body: undefined,
    });
  });

  it('tracks property interactions', async () => {
    const fetcher = createFetcher({ property: propertyResponse(), event: { id: 'event-1' } });
    const client = createRipplesApiClient({ fetcher });

    await client.likeProperty('property/1', { sessionId: 'session-1' }, 'access-token');

    expect(fetcher).toHaveBeenCalledWith(
      'http://localhost:3000/api/properties/property%2F1/like',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ sessionId: 'session-1' }),
      }),
    );
  });

  it('throws ApiClientError with string API messages', async () => {
    const fetcher = createFetcher({ message: 'Unauthorized' }, { ok: false, status: 401 });
    const client = createRipplesApiClient({ fetcher });

    await expect(client.getMe('bad-token')).rejects.toMatchObject({
      name: 'ApiClientError',
      message: 'Unauthorized',
      status: 401,
      details: { message: 'Unauthorized' },
    } satisfies Partial<ApiClientError>);
  });

  it('joins array API error messages', async () => {
    const fetcher = createFetcher(
      { message: ['Email is invalid.', 'Password is weak.', 12] },
      { ok: false, status: 400 },
    );
    const client = createRipplesApiClient({ fetcher });

    await expect(
      client.registerManual({
        fullName: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'Correct1!',
      }),
    ).rejects.toThrow('Email is invalid. Password is weak.');
  });

  it('uses a fallback error message for empty error responses', async () => {
    const fetcher = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve(''),
    });
    const client = createRipplesApiClient({ fetcher });

    await expect(client.getMe('access-token')).rejects.toThrow('Request failed.');
  });
});

function createFetcher(
  payload: unknown,
  init: { ok?: boolean; status?: number } = {},
): jest.MockedFunction<typeof fetch> {
  return jest.fn().mockResolvedValue(jsonResponse(payload, init));
}

function jsonResponse(payload: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    text: () => Promise.resolve(JSON.stringify(payload)),
  } as Response;
}

function authResponse(): {
  tokens: { accessToken: string; expiresIn: number; tokenType: 'Bearer' };
  user: { email: string; fullName: string; id: string; roles: ['user'] };
} {
  return {
    user: {
      id: 'user-1',
      email: 'ada@example.com',
      fullName: 'Ada Lovelace',
      roles: ['user'],
    },
    tokens: {
      accessToken: 'access-token',
      tokenType: 'Bearer',
      expiresIn: 900,
    },
  };
}

function createPropertyRequest(): {
  description: string;
  location: { city: string; country: string };
  media: [{ alt: string; type: 'image'; url: string }];
  price: { amount: number; currency: string };
  title: string;
} {
  return {
    title: 'Waterfront Apartment',
    description: 'A bright waterfront apartment with generous natural light.',
    location: {
      city: 'Accra',
      country: 'Ghana',
    },
    price: {
      amount: 250000,
      currency: 'USD',
    },
    media: [
      {
        url: 'https://example.com/property.jpg',
        type: 'image',
        alt: 'Waterfront apartment exterior',
      },
    ],
  };
}

function propertyResponse(): ReturnType<typeof createPropertyRequest> & {
  createdAt: string;
  id: string;
  media: [{ alt: string; id: string; type: 'image'; url: string }];
  status: 'active';
  updatedAt: string;
} {
  return {
    ...createPropertyRequest(),
    id: 'property-1',
    media: [{ id: 'media-1', ...createPropertyRequest().media[0] }],
    status: 'active',
    createdAt: '2026-04-16T00:00:00.000Z',
    updatedAt: '2026-04-16T00:00:00.000Z',
  };
}
