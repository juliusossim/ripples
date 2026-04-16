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
} from '@org/ui-primitives';
import type { AuthHeroProps, AuthPageLayoutProps } from './auth-page-layout.types';

export function AuthPageLayout({
  children,
  footerActionLabel,
  footerLabel,
  formDescription,
  formTitle,
  heroBody,
  heroItems,
  heroTitle,
  onFooterAction,
}: Readonly<AuthPageLayoutProps>): ReactElement {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <AuthHero body={heroBody} items={heroItems} title={heroTitle} />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{formTitle}</CardTitle>
            <CardDescription>{formDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">{children}</CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            {footerLabel}
            <Button className="px-2" onClick={onFooterAction} variant="link">
              {footerActionLabel}
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}

function AuthHero({ body, items, title }: Readonly<AuthHeroProps>): ReactElement {
  return (
    <div className="max-w-2xl space-y-6">
      <Badge className="w-fit" variant="secondary">
        Ripples
      </Badge>
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">{title}</h1>
        <p className="text-lg text-muted-foreground">{body}</p>
      </div>
      <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
        {items.map((item) => (
          <div className="rounded-lg border bg-card p-4" key={item}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
