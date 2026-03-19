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

/**
 * Converts any amount to a specific country's base currency.
 */
export function convertToBaseCurrency(
  amount: number,
  fromCurrency: Currency,
  baseCurrency: Currency,
  rates: ExchangeRates
): number {
  if (fromCurrency === baseCurrency) return amount;
  
  const fromRate = rates[fromCurrency] || DEFAULT_RATES[fromCurrency] || 1;
  const targetRate = rates[baseCurrency] || DEFAULT_RATES[baseCurrency] || 1;
  
  const amountInUSD = amount / fromRate;
  return amountInUSD * targetRate;
}

/**
 * Converts a specific country's base currency amount to any currency.
 */
export function convertFromBaseCurrency(
  baseAmount: number,
  baseCurrency: Currency,
  toCurrency: Currency,
  rates: ExchangeRates
): number {
  if (baseCurrency === toCurrency) return baseAmount;
  
  const baseRate = rates[baseCurrency] || DEFAULT_RATES[baseCurrency] || 1;
  const toRate = rates[toCurrency] || DEFAULT_RATES[toCurrency] || 1;
  
  const amountInUSD = baseAmount / baseRate;
  return amountInUSD * toRate;
}
