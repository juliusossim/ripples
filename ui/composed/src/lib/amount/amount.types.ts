export type AmountProps = Readonly<{
  price: number;
  currency: string;
  locale?: string;
  originalPrice?: number;
  discount?: number;
  increment?: number;
  showIncrement?: boolean;
  showOriginalPrice?: boolean;
  showDiscount?: boolean;
  className?: string;
  valueClassName?: string;
  originalPriceClassName?: string;
  discountClassName?: string;
  incrementClassName?: string;
}>;
