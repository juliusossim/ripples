import { render } from '@testing-library/react';

import RegistrationPage from './registration-page';
import { AuthProvider } from '../../session/provider/session-provider';

describe('RegistrationPage', () => {
  it('should render successfully', () => {
    const { baseElement } = renderRegistrationPage();
    expect(baseElement).toBeTruthy();
  });

  it('should include google and manual registration options', () => {
    const { getByText, getByLabelText } = renderRegistrationPage();

    expect(getByText('Continue with Google')).toBeTruthy();
    expect(getByLabelText('Full name')).toBeTruthy();
    expect(getByLabelText('Email')).toBeTruthy();
    expect(getByLabelText('Password')).toBeTruthy();
  });
});

function renderRegistrationPage(): ReturnType<typeof render> {
  return render(
    <AuthProvider refreshOnMount={false}>
      <RegistrationPage />
    </AuthProvider>,
  );
}
