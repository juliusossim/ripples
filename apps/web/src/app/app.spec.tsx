import { render } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the shared web UI shell', () => {
    const { getByText } = render(<App />);
    expect(getByText('AI Studio')).toBeTruthy();
  });
});
