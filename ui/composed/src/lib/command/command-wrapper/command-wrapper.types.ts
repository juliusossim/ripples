import type { ReactNode } from 'react';

export type CommandWrapperProps = Readonly<{
  trigger?: ReactNode;
  open: boolean;
  placeholder: string;
  openChange: (open: boolean) => void;
  children?: ReactNode;
  emptyText?: string;
  dialogClassName?: string;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
}>;
