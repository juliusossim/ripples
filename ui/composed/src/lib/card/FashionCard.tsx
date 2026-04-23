import type { DisplayProduct, TruncatedTextProps } from '@org/models';
import { buildPath, ROUTE_PATHS } from '@org/shared-data';
import { Eye, Handshake } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Amount,
  BrandsCarousel,
  SmallText,
  SocialInteractions,
  StarRating,
  Text,
  TruncatedText,
} from '../..';
import { BadgeVariants } from '../carousel/brandCarousel/types';
import { ProductCarousel } from '../carousel/productCarousel/ProductCarousel';
import { Button } from '../ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Item, ItemContent } from '../ui/item';
import { defaultBrands } from '../utils/mock';
import { SOLD_TEXT } from '../utils/text/fashionCard';

interface CardSettings {
  showBrandCarousel?: boolean;
  showRating?: boolean;
  showSocialInteractions?: boolean;
  showSoldText?: boolean;
  showPrice?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
  showTitle?: boolean;
  locale?: string;
  descriptionLineClamp: NonNullable<TruncatedTextProps['lineClamp']>;
  showOriginalPrice?: boolean;
  showDiscountPercentage?: boolean;
  showIncrement?: boolean;
  actionContent?: React.ReactNode;
  badgeVariant?: (typeof BadgeVariants)[keyof typeof BadgeVariants];
  showViewAction?: boolean;
  viewActionContent?: React.ReactNode;
}

const defaultSettings: CardSettings = {
  showBrandCarousel: true,
  showRating: true,
  showSocialInteractions: true,
  showSoldText: true,
  showPrice: true,
  showDescription: true,
  showActions: true,
  showTitle: true,
  locale: 'en-NG',
  descriptionLineClamp: 2,
  showOriginalPrice: true,
  showDiscountPercentage: true,
  showIncrement: true,
  actionContent: <Handshake size={16} />,
  badgeVariant: BadgeVariants.OUTLINE,
  showViewAction: true,
  viewActionContent: <Eye size={16} />,
};

export function FashionCard({
  product,
  settings = defaultSettings,
}: Readonly<{ product: DisplayProduct; settings?: CardSettings }>) {
  const navigate = useNavigate();
  const productDetailPath = buildPath(ROUTE_PATHS.PRODUCT_DETAIL, {
    id: product.id,
  });
  const onImageClick = ({ url, index }: { url: string; index: number }) => {
    console.log(`Clicked image ${index + 1} with URL: ${url}`);
    navigate(productDetailPath);
  };

  return (
    <Card className="w-full max-w-sm gap-0 pt-0 rounded-lg overflow-hidden border-0 hover-glow hover:transition-shadow duration-300">
      <ProductCarousel product={product} onImageClick={onImageClick} />
      <CardHeader className="gap-0 ">
        <CardTitle>
          <Item className="py-0 px-0 gap-0 flex-col items-start">
            {settings.showTitle && (
              <ItemContent className="flex flex-row justify-between w-full">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {product.name}
                </h3>
              </ItemContent>
            )}
            {settings.showPrice && (
              <Amount
                price={product.price.best}
                discount={23}
                locale={settings.locale}
                showOriginalPrice={settings.showOriginalPrice}
                showDiscount={settings.showDiscountPercentage}
                showIncrement={settings.showIncrement}
              />
            )}
          </Item>
        </CardTitle>
        {settings.showDescription && (
          <CardDescription>
            <TruncatedText
              tooltipSide="bottom"
              text={product.description}
              lineClamp={settings.descriptionLineClamp}
              className="text-sm text-muted-foreground"
            />
          </CardDescription>
        )}
        {settings.showActions && (
          <CardAction>
            <Button
              variant="secondary"
              className="cursor-pointer hover:text-primary/80 "
            >
              {settings.actionContent}
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-row items-center align-center gap-1">
        {settings.showBrandCarousel && (
          <ItemContent className="max-w-60">
            <BrandsCarousel
              brands={defaultBrands}
              showNavigation={false}
              badgeVariant={settings.badgeVariant}
            />
          </ItemContent>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-0 mt-1">
        <div className="flex flex-row items-center justify-between w-full">
          {settings.showRating && (
            <StarRating
              rating={product.rating}
              size={12}
              showValue
              className="my-2"
            />
          )}
          {settings.showSoldText && (
            <Text className="flex flex-row flex-nowrap gap-0.5 text-sm text-muted-foreground">
              <SmallText role="img" aria-label="hot" className="">
                <span role="img" aria-label="hot">
                  🔥
                </span>
              </SmallText>
              <SmallText>6k+ </SmallText>
              <SmallText>{SOLD_TEXT}</SmallText>
            </Text>
          )}
          {settings.showViewAction && (
            <Button>
              <Link
                to={productDetailPath}
                className="flex flex-row items-center gap-1"
              >
                {settings.viewActionContent}
              </Link>
            </Button>
          )}
        </div>

        {settings.showSocialInteractions && (
          <SocialInteractions productId="1" />
        )}
      </CardFooter>
    </Card>
  );
}
export default FashionCard;
