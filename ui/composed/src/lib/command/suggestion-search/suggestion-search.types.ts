import type { ReactNode } from 'react';

export type SuggestionSearchItem = Readonly<{
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  keywords?: readonly string[];
  onSelect?: () => void;
}>;

export type SuggestionSearchGroup = Readonly<{
  id: string;
  title: string;
  items: readonly SuggestionSearchItem[];
}>;

export type SuggestionSearchProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: readonly SuggestionSearchGroup[];
  placeholder: string;
  trigger?: ReactNode;
  emptyText?: string;
  title?: string;
  description?: string;
}>;
