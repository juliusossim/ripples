import { useCallback, useState, type ReactElement } from 'react';
import { SignInForm } from '../form/sign-in/sign-in-form';
import type { SignInFormValues } from '../form/sign-in/sign-in-form.schema';
import { AuthDivider, GoogleAuthButton } from '../form/shared/auth-form-controls';
import { readClientError } from '../google/auth-page-utils';
import { useGoogleAuthFlow } from '../google/use-google-auth-flow';
import { AuthPageLayout } from '../layout/auth-page-layout';
import { useSession } from '../../session/provider/session-provider';
import type { SignInPageProps } from './sign-in-page.types';

export function SignInPage({ onCreateAccount }: Readonly<SignInPageProps>): ReactElement {
  const { loginManual, status: sessionStatus } = useSession();
  const successMessage = useCallback((fullName: string) => `Welcome back, ${fullName}.`, []);
  const google = useGoogleAuthFlow({
    callbackMessage: 'Completing Google sign in...',
    successMessage,
  });
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);

  async function submitManualLogin(input: SignInFormValues): Promise<void> {
    setIsManualSubmitting(true);
    google.setMessage(undefined);
    try {
      const response = await loginManual(input);
      google.setMessage(successMessage(response.user.fullName));
    } catch (error) {
      google.setMessage(readClientError(error));
    } finally {
      setIsManualSubmitting(false);
    }
  }

  const isDisabled = isManualSubmitting || google.isGoogleConnecting;
  const isRestoringSession = sessionStatus === 'loading';

  return (
    <AuthPageLayout
      footerActionLabel="Create account"
      footerLabel="New to Ripples?"
      formDescription="Use Google or your email and password."
      formTitle="Sign in"
      heroBody="Sign in to continue tracking listings, referrals, and AI-ranked opportunities from one protected workspace."
      heroItems={['Saved listings', 'Reglam activity', 'Personal feed']}
      heroTitle="Return to your real estate feed."
      onFooterAction={onCreateAccount}
    >
      <GoogleAuthButton
        disabled={isDisabled || isRestoringSession}
        isConnecting={google.isGoogleConnecting}
        label="Continue with Google"
        onClick={() => void google.startGoogleAuth()}
      />
      <AuthDivider>or sign in manually</AuthDivider>
      <SignInForm
        disabled={isDisabled || isRestoringSession}
        isSubmitting={isManualSubmitting}
        message={google.message}
        onSubmit={submitManualLogin}
      />
    </AuthPageLayout>
  );
}

export default SignInPage;
