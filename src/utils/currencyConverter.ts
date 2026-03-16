import { Currency } from '../types/income';
import { ExchangeRates } from '../types/settings';
import { DEFAULT_RATES } from './exchangeRateService';

export function convertToNGN(
  amount: number,
  currency: Currency,
  rates: ExchangeRates
): number {
  if (currency === 'NGN') return amount;
  
  // Use provided rates or fallback to defaults to avoid NaN
  const rate = rates[currency] || DEFAULT_RATES[currency] || 1;
  const ngnRate = rates['NGN'] || DEFAULT_RATES['NGN'] || 1500;
  
  const amountInUSD = amount / rate;
  return amountInUSD * ngnRate;
}

export function convertFromNGN(
  amountNGN: number,
  currency: Currency,
  rates: ExchangeRates
): number {
  if (currency === 'NGN') return amountNGN;
  
  const rate = rates[currency] || DEFAULT_RATES[currency] || 1;
  const ngnRate = rates['NGN'] || DEFAULT_RATES['NGN'] || 1500;
  
  const amountInUSD = amountNGN / ngnRate;
  return amountInUSD * rate;
}
