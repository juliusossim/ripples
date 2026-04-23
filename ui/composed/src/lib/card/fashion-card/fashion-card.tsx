import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@org/ui-primitives';
import { Eye, Handshake } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { Amount } from '../../amount';
import { BrandCarousel, ProductCarousel } from '../../carousel';
import { SocialInteractions } from '../../social-interactions';
import { StarRating } from '../../stars';
import { SmallText, Text, TruncatedText } from '../../typography';
import type { FashionCardProps, FashionCardSettings } from './fashion-card.types';

const SOLD_TEXT = 'sold recently';

const defaultSettings: FashionCardSettings = {
  showBrandCarousel: true,
  showRating: true,
  showSocialInteractions: true,
  showSoldText: true,
  showPrice: true,
  showDescription: true,
  showActions: true,
  showTitle: true,
  descriptionLineClamp: 2,
  showOriginalPrice: true,
  showDiscountPercentage: true,
  showIncrement: true,
  actionContent: <Handshake className="h-4 w-4" />,
  badgeVariant: 'outline',
  showViewAction: true,
  viewActionContent: <Eye className="h-4 w-4" />,
};

function resolveSettings(settings?: FashionCardSettings): FashionCardSettings {
  return {
    ...defaultSettings,
    ...settings,
  };
}

function renderViewAction({
  href,
  label,
}: Readonly<{ href: string; label: ReactNode }>): ReactElement {
  return (
    <a className="flex flex-row items-center gap-1" href={href}>
      {label}
    </a>
  );
}

export function FashionCard({
  product,
  settings,
  onProductClick,
  onPrimaryAction,
  onViewAction,
  onInteraction,
}: Readonly<FashionCardProps>): ReactElement {
  const resolvedSettings = resolveSettings(settings);

  return (
    <Card className="w-full max-w-sm gap-0 overflow-hidden rounded-lg border-0 pt-0 duration-300 hover:shadow-xl">
      <ProductCarousel
        product={product}
        onImageClick={() => onProductClick?.(product)}
      />
      <CardHeader className="gap-0">
        <CardTitle className="space-y-2">
          {resolvedSettings.showTitle ? (
            <div className="flex w-full flex-row justify-between">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {product.name}
              </h3>
            </div>
          ) : null}
          {resolvedSettings.showPrice ? (
            <Amount
              {...product.price}
              showDiscount={resolvedSettings.showDiscountPercentage}
              showIncrement={resolvedSettings.showIncrement}
              showOriginalPrice={resolvedSettings.showOriginalPrice}
            />
          ) : null}
        </CardTitle>
        {resolvedSettings.showDescription ? (
          <TruncatedText
            className="text-sm text-muted-foreground"
            lineClamp={resolvedSettings.descriptionLineClamp}
            text={product.description}
            tooltipSide="bottom"
          />
        ) : null}
        {resolvedSettings.showActions ? (
          <div className="mt-3 flex justify-end">
            <Button
              className="cursor-pointer hover:text-primary/80"
              onClick={() => onPrimaryAction?.(product)}
              variant="secondary"
            >
              {resolvedSettings.actionContent}
            </Button>
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="mt-1 flex flex-row items-center gap-1">
        {resolvedSettings.showBrandCarousel && product.brands?.length ? (
          <div className="max-w-60">
            <BrandCarousel
              badgeVariant={resolvedSettings.badgeVariant}
              brands={product.brands}
              showNavigation={false}
            />
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="mt-1 flex-col gap-0">
        <div className="flex w-full flex-row items-center justify-between gap-4">
          {resolvedSettings.showRating && typeof product.rating === 'number' ? (
            <StarRating
              className="my-2"
              rating={product.rating}
              showValue
              size={12}
            />
          ) : (
            <span />
          )}
          {resolvedSettings.showSoldText ? (
            <Text className="flex flex-row flex-nowrap gap-0.5 text-sm text-muted-foreground">
              <SmallText className="" role="img" aria-label="hot">
                <span aria-label="hot" role="img">
                  🔥
                </span>
              </SmallText>
              <SmallText>{product.soldLabel ?? '6k+'} </SmallText>
              <SmallText>{SOLD_TEXT}</SmallText>
            </Text>
          ) : null}
          {resolvedSettings.showViewAction ? (
            <Button
              onClick={() => onViewAction?.(product)}
              variant="default"
            >
              {product.detailHref
                ? renderViewAction({
                    href: product.detailHref,
                    label: resolvedSettings.viewActionContent ?? 'View',
                  })
                : resolvedSettings.viewActionContent ?? 'View'}
            </Button>
          ) : null}
        </div>

        {resolvedSettings.showSocialInteractions ? (
          <SocialInteractions
            counts={product.interactionCounts}
            onInteraction={(action, extra) => onInteraction?.(action, product, extra)}
            state={product.interactionState}
            variant="inline"
          />
        ) : null}
      </CardFooter>
    </Card>
  );
}
