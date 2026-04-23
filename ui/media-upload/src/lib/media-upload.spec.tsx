import { render, screen } from '@testing-library/react';
import { MediaUpload } from './media-upload';

interface GlobalEnvOverride {
  __RIPPLES_MEDIA_UPLOAD_ENV__?: Record<string, string | undefined>;
}

function setMediaUploadEnv(values: Record<string, string | undefined>): void {
  const globalObject = globalThis as GlobalEnvOverride;
  globalObject.__RIPPLES_MEDIA_UPLOAD_ENV__ = values;
}

describe('MediaUpload', () => {
  afterEach(() => {
    setMediaUploadEnv({});
  });

  it('shows configured provider status when cloud picker env is present', () => {
    setMediaUploadEnv({
      VITE_DROPBOX_APP_KEY: 'dropbox-key',
      VITE_GOOGLE_PICKER_API_KEY: 'api-key',
      VITE_GOOGLE_PICKER_APP_ID: 'app-id',
      VITE_GOOGLE_PICKER_CLIENT_ID: 'client-id',
    });

    renderMediaUpload();

    expect(screen.getByText('Picker status')).toBeTruthy();
    expect(screen.getAllByText('Google Drive').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Dropbox').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ready').length).toBeGreaterThanOrEqual(4);
  });

  it('shows setup hints when cloud picker env is missing', () => {
    renderMediaUpload();

    expect(screen.getAllByText('Setup needed').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/VITE_GOOGLE_PICKER_API_KEY/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/VITE_DROPBOX_APP_KEY/).length).toBeGreaterThan(0);
  });
});

function renderMediaUpload(): ReturnType<typeof render> {
  return render(
    <MediaUpload onChange={() => undefined} onUploadFiles={async () => []} value={[]} />,
  );
}
