import type {
  AuthResponse,
  AuthUser,
  CreatePropertyRequest,
  FeedResponse,
  GoogleOAuthCallbackRequest,
  GoogleOAuthStartRequest,
  GoogleOAuthStartResponse,
  LoginManualRequest,
  LogoutRequest,
  Property,
  PropertyInteractionRequest,
  PropertyInteractionResponse,
  RefreshTokenRequest,
  RegisterManualRequest,
} from '@org/types';

export interface RipplesApiClientOptions {
  readonly baseUrl?: string;
  readonly fetcher?: typeof fetch;
}

export interface RipplesApiClient {
  registerManual(input: RegisterManualRequest): Promise<AuthResponse>;
  loginManual(input: LoginManualRequest): Promise<AuthResponse>;
  refresh(input?: RefreshTokenRequest): Promise<AuthResponse>;
  logout(input?: LogoutRequest): Promise<{ success: true }>;
  startGoogleOAuth(input: GoogleOAuthStartRequest): Promise<GoogleOAuthStartResponse>;
  completeGoogleOAuth(input: GoogleOAuthCallbackRequest): Promise<AuthResponse>;
  getMe(accessToken: string): Promise<AuthUser>;
  createProperty(input: CreatePropertyRequest, accessToken?: string): Promise<Property>;
  getProperties(accessToken?: string): Promise<Property[]>;
  getFeed(input?: FeedRequestOptions, accessToken?: string): Promise<FeedResponse>;
  viewProperty(
    propertyId: string,
    input: PropertyInteractionRequest,
    accessToken?: string,
  ): Promise<PropertyInteractionResponse>;
  likeProperty(
    propertyId: string,
    input: PropertyInteractionRequest,
    accessToken?: string,
  ): Promise<PropertyInteractionResponse>;
  saveProperty(
    propertyId: string,
    input: PropertyInteractionRequest,
    accessToken?: string,
  ): Promise<PropertyInteractionResponse>;
  shareProperty(
    propertyId: string,
    input: PropertyInteractionRequest,
    accessToken?: string,
  ): Promise<PropertyInteractionResponse>;
}

export interface FeedRequestOptions {
  readonly limit?: number;
  readonly cursor?: string;
}
