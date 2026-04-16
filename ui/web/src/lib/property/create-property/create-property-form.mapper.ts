import type { CreatePropertyRequest } from '@org/types';
import type { CreatePropertyFormValues } from './create-property-form.schema';

export function createDefaultPropertyFormValues(): CreatePropertyFormValues {
  return {
    title: '',
    description: '',
    city: '',
    country: '',
    priceAmount: 250000,
    priceCurrency: 'USD',
    imageUrl: '',
    imageAlt: '',
  };
}

export function toCreatePropertyRequest(values: CreatePropertyFormValues): CreatePropertyRequest {
  return {
    title: values.title,
    description: values.description,
    location: {
      city: values.city,
      country: values.country,
    },
    price: {
      amount: values.priceAmount,
      currency: values.priceCurrency,
    },
    media: [
      {
        url: values.imageUrl,
        type: 'image',
        alt: values.imageAlt,
      },
    ],
    status: 'active',
  };
}
