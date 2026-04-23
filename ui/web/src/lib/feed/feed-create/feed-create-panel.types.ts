import type { CreatePropertyRequest } from '@org/types';

export interface FeedCreatePanelProps {
  readonly accessToken?: string;
  readonly isCreatingProperty: boolean;
  readonly onPropertySubmit: (input: CreatePropertyRequest) => Promise<void>;
  readonly propertyError?: string;
  readonly title: string;
}
