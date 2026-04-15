import type { ReactElement } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@org/ui-primitives';

export function OrgUiWeb(): ReactElement {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center gap-6">
          <Badge className="w-fit" variant="secondary">
            AI Studio
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
              Agentic AI systems with a shared UI foundation.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Tailwind and shadcn-style primitives are ready for the web app and reusable web UI
              packages.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button>Open workspace</Button>
            <Button variant="outline">Review components</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prompt run</CardTitle>
            <CardDescription>Example controls composed from shared primitives.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name">Agent name</Label>
              <Input id="agent-name" placeholder="Research assistant" />
            </div>
            <div className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
              Components live in <span className="font-medium text-foreground">ui/primitives</span>
              and are consumed by <span className="font-medium text-foreground">ui/web</span>.
            </div>
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <Button size="sm" variant="ghost">
              Save draft
            </Button>
            <Button size="sm" variant="secondary">
              Run preview
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}

export default OrgUiWeb;
