import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@org/ui-primitives';
import type {
  DefaultWebErrorFallbackProps,
  WebErrorBoundaryProps,
  WebErrorBoundaryState,
} from './error-boundary.types';

export class WebErrorBoundary extends Component<
  Readonly<WebErrorBoundaryProps>,
  WebErrorBoundaryState
> {
  override state: WebErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error): WebErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Web app render error', { error, errorInfo });
  }

  override render(): ReactNode {
    if (!this.state.error) {
      return this.props.children;
    }

    return this.props.fallback ?? <DefaultWebErrorFallback onReset={() => this.reset()} />;
  }

  private reset(): void {
    this.setState({ error: undefined });
  }
}

function DefaultWebErrorFallback({ onReset }: Readonly<DefaultWebErrorFallbackProps>): ReactNode {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Ripples</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The app hit a recoverable rendering error. Try again, and if it repeats, refresh the
          browser after the dev server finishes rebuilding.
        </p>
        <Button className="mt-5 w-full" onClick={onReset}>
          Try again
        </Button>
      </section>
    </main>
  );
}
