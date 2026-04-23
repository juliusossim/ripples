import type { ReactElement } from 'react';
import { FashionCard } from '../../card';
import type { ProductGridProps } from './product-grid.types';

const EMPTY_PRODUCTS_TEXT = 'No products found.';

export function ProductGrid({
  products,
  emptyText = EMPTY_PRODUCTS_TEXT,
  fashionCardSettings,
  onProductClick,
  onPrimaryAction,
  onViewAction,
  onInteraction,
}: Readonly<ProductGridProps>): ReactElement {
  if (products.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-lg text-muted-foreground">
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid justify-items-center gap-1 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <FashionCard
          key={product.id}
          onInteraction={onInteraction}
          onPrimaryAction={onPrimaryAction}
          onProductClick={onProductClick}
          onViewAction={onViewAction}
          product={product}
          settings={fashionCardSettings}
        />
      ))}
    </div>
  );
}
