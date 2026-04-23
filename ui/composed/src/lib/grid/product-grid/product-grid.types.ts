import type { FashionCardProduct, FashionCardSettings } from '../../card';
import type { SocialInteractionAction } from '../../social-interactions';

export type ProductGridProps = Readonly<{
  products: readonly FashionCardProduct[];
  emptyText?: string;
  fashionCardSettings?: FashionCardSettings;
  onProductClick?: (product: FashionCardProduct) => void;
  onPrimaryAction?: (product: FashionCardProduct) => void;
  onViewAction?: (product: FashionCardProduct) => void;
  onInteraction?: (
    action: SocialInteractionAction,
    product: FashionCardProduct,
    extra?: Record<string, unknown>,
  ) => void;
}>;
