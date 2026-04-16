import type { CreatePropertyRequest } from '@org/types';

export interface FeedWorkspaceCreatePanelProps {
  readonly accessToken?: string;
  readonly error?: string;
  readonly isSubmitting: boolean;
  readonly onSubmit: (input: CreatePropertyRequest) => Promise<void>;
  readonly title: string;
}
