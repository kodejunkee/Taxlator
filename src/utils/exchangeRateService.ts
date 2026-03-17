import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExchangeRates } from '../types/settings';

const RATES_KEY = '@exchange_rates';
const LAST_FETCH_KEY = '@last_fetch_date';
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export const DEFAULT_RATES: ExchangeRates = {
  USD: 1,
  NGN: 1540, // More recent fallback
  GBP: 0.79,
  EUR: 0.92,
  JPY: 150,
  CAD: 1.35,
  AUD: 1.52,
  CNY: 7.23,
  INR: 83.3,
  AED: 3.67,
};

export async function fetchExchangeRates(forceRefresh: boolean = false): Promise<ExchangeRates> {
  try {
    const lastFetchStr = await AsyncStorage.getItem(LAST_FETCH_KEY);
    const today = new Date().toISOString().split('T')[0];

    // Check if we need to fetch new rates
    if (!forceRefresh && lastFetchStr === today) {
      const storedRatesStr = await AsyncStorage.getItem(RATES_KEY);
      if (storedRatesStr) {
        const parsed = JSON.parse(storedRatesStr);
        // Force refresh if we have a very small number of rates (stale cache from old version)
        if (Object.keys(parsed).length > 10) {
          return parsed;
        }
      }
    }

    // Fetch new rates
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Store ALL rates from the API
    const newRates: ExchangeRates = {
      ...data.rates,
      USD: 1, // Ensure base is correct
    };

    // Store rates locally
    await AsyncStorage.setItem(RATES_KEY, JSON.stringify(newRates));
    await AsyncStorage.setItem(LAST_FETCH_KEY, today);

    return newRates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates, using fallback or stored rates.', error);
    const storedRatesStr = await AsyncStorage.getItem(RATES_KEY);
    if (storedRatesStr) {
      return JSON.parse(storedRatesStr);
    }
    return DEFAULT_RATES;
  }
}
