import { useCallback, useState, type ReactElement } from 'react';
import { RegistrationForm } from '../form/registration/registration-form';
import type { RegistrationFormValues } from '../form/registration/registration-form.schema';
import { AuthDivider, GoogleAuthButton } from '../form/shared/auth-form-controls';
import { apiUnavailableMessage, readClientError } from '../google/auth-page-utils';
import { useGoogleAuthFlow } from '../google/use-google-auth-flow';
import { AuthApiRecovery } from '../layout/auth-api-recovery';
import { AuthPageLayout } from '../layout/auth-page-layout';
import { useSession } from '../../session/provider/session-provider';
import type { RegistrationPageProps } from './registration-page.types';

export function RegistrationPage({ onSignIn }: Readonly<RegistrationPageProps>): ReactElement {
  const { error: sessionError, registerManual, status: sessionStatus } = useSession();
  const successMessage = useCallback((fullName: string) => `Welcome to Ripples, ${fullName}.`, []);
  const google = useGoogleAuthFlow({
    callbackMessage: 'Completing Google sign up...',
    successMessage,
  });
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);

  async function submitManualRegistration(input: RegistrationFormValues): Promise<void> {
    setIsManualSubmitting(true);
    google.setMessage(undefined);
    try {
      const response = await registerManual({
        fullName: input.fullName,
        email: input.email,
        password: input.password,
      });
      google.setMessage(successMessage(response.user.fullName));
    } catch (error) {
      google.setMessage(readClientError(error));
    } finally {
      setIsManualSubmitting(false);
    }
  }

  const isDisabled = isManualSubmitting || google.isGoogleConnecting;
  const isRestoringSession = sessionStatus === 'loading';
  const statusMessage =
    google.message ?? (sessionError === apiUnavailableMessage ? undefined : sessionError);

  return (
    <AuthPageLayout
      footerActionLabel="Sign in"
      footerLabel="Already have an account?"
      formDescription="Choose Google signup or enter your details manually."
      formTitle="Create your account"
      heroBody="Register with Google or create an account manually to discover, share, and convert real estate opportunities through a social AI feed."
      heroItems={['Feed-first discovery', 'Social sharing', 'AI ranking']}
      heroTitle="Create your agent workspace."
      onFooterAction={onSignIn}
    >
      <AuthApiRecovery />
      <GoogleAuthButton
        disabled={isDisabled || isRestoringSession}
        isConnecting={google.isGoogleConnecting}
        label="Continue with Google"
        onClick={() => void google.startGoogleAuth()}
      />
      <AuthDivider>or register manually</AuthDivider>
      <RegistrationForm
        disabled={isDisabled || isRestoringSession}
        isSubmitting={isManualSubmitting}
        message={statusMessage}
        onSubmit={submitManualRegistration}
      />
    </AuthPageLayout>
  );
}

export default RegistrationPage;
