import { cn, ItemContent } from '@org/ui-primitives';
import { formatCurrency } from '@org/utils';
import type { ReactElement } from 'react';
import type { AmountProps } from './amount.types';

function calculateReferencePrice({
  discount,
  increment,
  originalPrice,
  price,
}: Readonly<Pick<AmountProps, 'discount' | 'increment' | 'originalPrice' | 'price'>>): number | null {
  if (typeof originalPrice === 'number' && originalPrice > 0) {
    return originalPrice;
  }

  if (typeof discount === 'number' && discount > 0 && discount < 100) {
    return price / (1 - discount / 100);
  }

  if (typeof increment === 'number' && increment > 0) {
    return price / (1 + increment / 100);
  }

  return null;
}

export function Amount({
  price,
  currency,
  locale,
  originalPrice,
  discount,
  increment,
  showIncrement = true,
  showOriginalPrice = true,
  showDiscount = true,
  className,
}: Readonly<AmountProps>): ReactElement {
  const formattedPrice = formatCurrency(price, currency, locale);
  const referencePrice = calculateReferencePrice({
    discount,
    increment,
    originalPrice,
    price,
  });
  const formattedOriginalPrice =
    typeof referencePrice === 'number' ? formatCurrency(referencePrice, currency, locale) : null;
  const resolvedDiscount =
    typeof discount === 'number'
      ? discount
      : typeof referencePrice === 'number' && referencePrice > 0
        ? Math.round((1 - price / referencePrice) * 100)
        : null;
  const resolvedIncrement =
    typeof increment === 'number'
      ? increment
      : typeof referencePrice === 'number' && referencePrice > 0
        ? ((price - referencePrice) / referencePrice) * 100
        : null;

  return (
    <ItemContent className={cn('flex flex-row items-center gap-2', className)}>
      <p className="text-sm font-medium text-foreground">{formattedPrice}</p>
      {showOriginalPrice && formattedOriginalPrice ? (
        <p className="text-sm text-muted-foreground line-through">{formattedOriginalPrice}</p>
      ) : null}
      {showDiscount && typeof resolvedDiscount === 'number' && resolvedDiscount > 0 ? (
        <p className="text-sm text-destructive">-{resolvedDiscount}%</p>
      ) : null}
      {showIncrement && typeof resolvedIncrement === 'number' && resolvedIncrement > 0 ? (
        <p className="text-sm text-emerald-600">+{resolvedIncrement.toFixed(2)}%</p>
      ) : null}
    </ItemContent>
  );
}
