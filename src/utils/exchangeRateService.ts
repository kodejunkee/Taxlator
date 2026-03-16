import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExchangeRates } from '../types/settings';

const RATES_KEY = '@exchange_rates';
const LAST_FETCH_KEY = '@last_fetch_date';
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

const DEFAULT_RATES: ExchangeRates = {
  USD: 1,
  NGN: 1500, // Fallback rate
  GBP: 0.79,
  EUR: 0.92,
};

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    const lastFetchStr = await AsyncStorage.getItem(LAST_FETCH_KEY);
    const today = new Date().toISOString().split('T')[0];

    // Check if we need to fetch new rates
    if (lastFetchStr === today) {
      const storedRatesStr = await AsyncStorage.getItem(RATES_KEY);
      if (storedRatesStr) {
        return JSON.parse(storedRatesStr);
      }
    }

    // Fetch new rates
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    const newRates: ExchangeRates = {
      USD: 1,
      NGN: data.rates.NGN || DEFAULT_RATES.NGN,
      GBP: data.rates.GBP || DEFAULT_RATES.GBP,
      EUR: data.rates.EUR || DEFAULT_RATES.EUR,
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
