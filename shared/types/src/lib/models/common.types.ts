export interface GeoLocation {
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Locality {
  city: string;
  country: string;
}

export type CurrencyCode =
  | 'NGN'
  | 'USD'
  | 'CAD'
  | 'AUD'
  | 'GHS'
  | 'KES'
  | 'ZAR'
  | 'GBP'
  | 'EUR'
  | 'JPY'
  | 'CNY'
  | 'INR'
  | 'RIPPLE';

export interface Money {
  amount: number;
  currency: CurrencyCode | string;
}

export interface Address {
  line1?: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  formatted?: string;
  landmark?: string;
}
