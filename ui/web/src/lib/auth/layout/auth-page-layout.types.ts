import type { ReactNode } from 'react';

export interface AuthPageLayoutProps {
  readonly children: ReactNode;
  readonly footerActionLabel: string;
  readonly footerLabel: string;
  readonly formDescription: string;
  readonly formTitle: string;
  readonly heroBody: string;
  readonly heroItems: readonly string[];
  readonly heroTitle: string;
  readonly onFooterAction?: () => void;
}

export interface AuthHeroProps {
  readonly body: string;
  readonly items: readonly string[];
  readonly title: string;
}
