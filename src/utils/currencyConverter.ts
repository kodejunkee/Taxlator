import { Currency } from '../types/income';
import { ExchangeRates } from '../types/settings';

export function convertToNGN(
  amount: number,
  currency: Currency,
  rates: ExchangeRates
): number {
  if (currency === 'NGN') return amount;
  
  // Convert from source currency to base (USD), then to NGN
  const amountInUSD = amount / rates[currency];
  return amountInUSD * rates['NGN'];
}

export function convertFromNGN(
  amountNGN: number,
  currency: Currency,
  rates: ExchangeRates
): number {
  if (currency === 'NGN') return amountNGN;
  
  // Convert NGN to base (USD), then to target currency
  const amountInUSD = amountNGN / rates['NGN'];
  return amountInUSD * rates[currency];
}
