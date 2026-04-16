import type { ReactElement } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@org/ui-primitives';

export function AuthLoadingState(): ReactElement {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Checking your session</CardTitle>
          <CardDescription>Restoring your Ripples workspace.</CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}

export function UnauthenticatedState(): ReactElement {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>This workspace is only available after authentication.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Open the sign-in page to continue.</p>
        </CardContent>
      </Card>
    </main>
  );
}
