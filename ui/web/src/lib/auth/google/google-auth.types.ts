export interface OAuthCallbackParams {
  readonly code: string;
  readonly state: string;
  readonly redirectUri: string;
}

export interface GoogleAuthFlowOptions {
  readonly callbackMessage: string;
  readonly successMessage: (fullName: string) => string;
}

export interface GoogleAuthFlowState {
  readonly isGoogleConnecting: boolean;
  readonly message?: string;
  readonly setMessage: (message: string | undefined) => void;
  readonly startGoogleAuth: () => Promise<void>;
}
