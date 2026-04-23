import { defaultLocale, localeCurrencyMap } from '../utils';

export function useUserCurrency(): { locale: string; currency: string } {
  return {
    locale: defaultLocale,
    currency: localeCurrencyMap[defaultLocale] || 'USD',
  };
}
