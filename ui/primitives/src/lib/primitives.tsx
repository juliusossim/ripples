import type { ReactElement } from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

export function OrgUiPrimitives(): ReactElement {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <Badge className="w-fit" variant="secondary">
          Primitives
        </Badge>
        <CardTitle>Shadcn-ready primitives</CardTitle>
        <CardDescription>Composable UI building blocks for the web app.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Start building</Button>
      </CardContent>
    </Card>
  );
}

export default OrgUiPrimitives;
