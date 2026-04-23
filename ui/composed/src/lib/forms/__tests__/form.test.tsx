import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormProvider } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { Button } from '../../ui/button';
import { FormInput } from '../components/input/FormInput';
import { useZodForm } from '../hooks/useZodForm';

// Example: Testing a simple login form
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm({ onSubmit }: { onSubmit: (data: LoginFormData) => void }) {
  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput name="email" label="Email" type="email" />
        <FormInput name="password" label="Password" type="password" />
        <Button type="submit">Login</Button>
      </form>
    </FormProvider>
  );
}

describe('LoginForm', () => {
  it('should render form fields', () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show validation errors for invalid inputs', async () => {
    const handleSubmit = vi.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    // Ensure submit was not called
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const handleSubmit = vi.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'securePassword123' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check that submit was called with correct data
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'securePassword123',
        },
        expect.anything()
      );
    });
  });

  it('should validate email format', async () => {
    const handleSubmit = vi.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    // Enter invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'securePassword123' },
    });

    // Blur to trigger validation
    fireEvent.blur(screen.getByLabelText(/email/i));

    // Check for email validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('should clear errors when input becomes valid', async () => {
    const handleSubmit = vi.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    // Enter invalid email
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.blur(emailInput);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    // Clear and enter valid email
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.blur(emailInput);

    // Error should be gone
    await waitFor(() => {
      expect(
        screen.queryByText(/invalid email address/i)
      ).not.toBeInTheDocument();
    });
  });
});

// Example: Testing async form submission
describe('Async Form Submission', () => {
  it('should handle loading state during submission', async () => {
    const handleSubmit = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
    render(<LoginForm onSubmit={handleSubmit} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'securePassword123' },
    });

    // Submit
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Submission should be triggered
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
