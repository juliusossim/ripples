import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './loading-spinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByLabelText('Loading');
    expect(spinner).toBeInTheDocument();
  });

  it('should display loading text', () => {
    render(<LoadingSpinner message="Loading..." />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render spinner status element', () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector('svg[role="status"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByLabelText('Loading');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });
});
