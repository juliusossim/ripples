import type { DisplayProduct } from '@org/models';
import FashionCard from '../card/FashionCard';
import { EMPTY_PRODUCTS_TEXT } from '../utils/text/productGrid';

export function ProductGrid({
  products,
}: Readonly<{ products: DisplayProduct[] }>) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 px-4 text-muted-foreground text-lg">
        <p>{EMPTY_PRODUCTS_TEXT}</p>
      </div>
    );
  }

  return (
    <div className="grid justify-items-center md:grid-cols-2 xl:grid-cols-4 gap-1">
      {products.map((product) => (
        <FashionCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
