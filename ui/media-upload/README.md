# @org/ui-media-upload

Reusable browser-side media selection and import flows for Ripples.

It currently powers listing media creation with:

- drag and drop from device
- manual file selection from device
- direct public media links
- Google Drive picker import
- Dropbox picker import

The library keeps one upload contract for consumers:

- picker/link/device selection happens here
- selected assets are converted into `File[]` when needed
- the consuming app persists those files through `onUploadFiles(files)`

That means product flows such as property creation do not need to know whether media came from
device, Drive, Dropbox, or a pasted link.

## Environment

`apps/web/.env.example` contains the web-side variables required for cloud pickers.

Google Drive picker:

- `VITE_GOOGLE_PICKER_API_KEY`
- `VITE_GOOGLE_PICKER_APP_ID`
- `VITE_GOOGLE_PICKER_CLIENT_ID`

Dropbox picker:

- `VITE_DROPBOX_APP_KEY`

If these values are missing, the picker buttons stay disabled and the UI shows setup hints instead
of failing.

## Local Setup

1. Copy `apps/web/.env.example` to `apps/web/.env`.
2. Add your Ripples API base URL to `VITE_API_URL` if it differs from localhost.
3. Create a Google Cloud project and enable the Google Picker / Drive APIs.
4. Add the Google picker API key, app ID, and OAuth client ID to `apps/web/.env`.
5. Create a Dropbox app and add its chooser app key to `apps/web/.env`.
6. Restart `pnpm dev` after updating environment variables.

## Notes

- Google Drive and Dropbox imports are uploaded back into Ripples after selection, so listings do
  not depend on long-lived third-party sharing URLs.
- Public shared links still work through the manual link import path, even when picker credentials
  are not configured.

## Running unit tests

Run `nx test @org/ui-media-upload` to execute the unit tests via [Vitest](https://vitest.dev/).
