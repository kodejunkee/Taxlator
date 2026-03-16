import { Currency } from '../types/income';

/**
 * Returns the symbol for a given currency code
 */
export const getCurrencySymbol = (currency: Currency): string => {
  switch (currency) {
    case 'USD': return '$';
    case 'GBP': return '£';
    case 'EUR': return '€';
    case 'NGN': return '₦';
    default: return '₦';
  }
};

/**
 * Formats a string number with commas as thousands separators.
 * Only handles positive numbers and integers/decimals for currency input.
 */
export const formatInputAmount = (value: string): string => {
  // Remove any character that isn't a digit or dot
  const cleanValue = value.replace(/[^\d.]/g, '');
  
  // Handle multiple dots (keep only the first one)
  const parts = cleanValue.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1].slice(0, 2) : ''; // Limit to 2 decimals
  
  if (!integerPart && !decimalPart) return '';
  
  // Format integer part with commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return formattedInteger + decimalPart;
};

/**
 * Strips commas from a formatted string to get a numeric value
 */
export const parseFormattedAmount = (value: string): number => {
  if (!value) return 0;
  const stripped = value.replace(/,/g, '');
  return parseFloat(stripped) || 0;
};
