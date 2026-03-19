import { Currency } from '../types/income';

export interface CountryOption {
  id: string;
  name: string;
  currency: Currency;
  flag: string;
  isSupported?: boolean;
}

export const COUNTRIES: CountryOption[] = [
  { id: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬', isSupported: true },
  { id: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸', isSupported: false },
  { id: 'UK', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧', isSupported: true },
  { id: 'SG', name: 'Singapore', currency: 'SGD', flag: '🇸🇬', isSupported: true },
  { id: 'EU', name: 'European Union', currency: 'EUR', flag: '🇪🇺', isSupported: false },
  { id: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦', isSupported: false },
];

export const getBaseCurrency = (countryId: string): Currency => {
  const country = COUNTRIES.find(c => c.id === countryId);
  return country ? country.currency : 'NGN';
};
