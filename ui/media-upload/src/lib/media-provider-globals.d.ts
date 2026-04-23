declare global {
  interface Window {
    Dropbox?: DropboxSdk;
    gapi?: GoogleApiNamespace;
    google?: GoogleNamespace;
  }
}

interface DropboxChooserFile {
  readonly bytes: number;
  readonly link: string;
  readonly name: string;
}

interface DropboxChooserOptions {
  readonly cancel?: () => void;
  readonly extensions?: readonly string[];
  readonly linkType?: 'preview' | 'direct';
  readonly multiselect?: boolean;
  readonly success: (files: DropboxChooserFile[]) => void;
}

interface DropboxSdk {
  choose(options: DropboxChooserOptions): void;
}

interface GoogleOAuthTokenClient {
  requestAccessToken(options?: { prompt?: '' | 'consent' }): void;
}

interface GoogleOAuthTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleOAuthNamespace {
  initTokenClient(config: {
    callback: (response: GoogleOAuthTokenResponse) => void;
    client_id: string;
    error_callback?: () => void;
    scope: string;
  }): GoogleOAuthTokenClient;
}

interface GooglePickerDocument {
  readonly id?: string;
  readonly mimeType?: string;
  readonly name?: string;
}

interface GooglePickerResponse {
  readonly [key: string]: unknown;
  readonly action?: string;
  readonly docs?: GooglePickerDocument[];
}

interface GooglePickerBuilder {
  addView(view: GooglePickerDocsView): GooglePickerBuilder;
  build(): { setVisible(visible: boolean): void };
  setAppId(appId: string): GooglePickerBuilder;
  setCallback(callback: (response: GooglePickerResponse) => void): GooglePickerBuilder;
  setDeveloperKey(apiKey: string): GooglePickerBuilder;
  setOAuthToken(token: string): GooglePickerBuilder;
}

interface GooglePickerDocsView {
  setIncludeFolders(includeFolders: boolean): GooglePickerDocsView;
  setMimeTypes(mimeTypes: string): GooglePickerDocsView;
  setSelectFolderEnabled(enabled: boolean): GooglePickerDocsView;
}

interface GooglePickerNamespace {
  readonly Action: {
    readonly CANCEL: string;
    readonly PICKED: string;
  };
  readonly DocsView: new (viewId: string) => GooglePickerDocsView;
  readonly PickerBuilder: new () => GooglePickerBuilder;
  readonly Response: {
    readonly ACTION: string;
    readonly DOCUMENTS: string;
  };
  readonly ViewId: {
    readonly DOCS: string;
  };
}

interface GoogleNamespace {
  readonly accounts: {
    readonly oauth2: GoogleOAuthNamespace;
  };
  readonly picker: GooglePickerNamespace;
}

interface GoogleApiNamespace {
  load(
    name: string,
    options: {
      callback: () => void;
      onerror?: () => void;
    },
  ): void;
}

export {};
