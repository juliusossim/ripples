import { formatCurrency } from './format-currency.js';

describe('formatCurrency', () => {
  it('formats a value with the provided currency and locale', () => {
    expect(formatCurrency(250000, 'USD', 'en-US')).toBe('$250,000');
  });

  it('uses the runtime locale when no locale is provided', () => {
    expect(formatCurrency(250000, 'USD')).toEqual(expect.any(String));
  });

  it('falls back to USD when the currency code is invalid', () => {
    expect(formatCurrency(250000, 'INVALID', 'en-US')).toBe('$250,000');
  });
});
