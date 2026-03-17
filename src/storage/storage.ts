import AsyncStorage from '@react-native-async-storage/async-storage';
import { IncomeEntry, TaxSavings } from '../types/income';
import { UserSettings } from '../types/settings';

const INCOME_KEY = '@income_entries';
const SAVINGS_KEY = '@tax_savings';
const SETTINGS_KEY = '@user_settings';

export const defaultSettings: UserSettings = {
  preferredCurrency: 'NGN',
  exchangeRates: { USD: 1, NGN: 1500, GBP: 0.79, EUR: 0.92 },
  currencyUsage: {},
};

export const StorageService = {
  async getIncomes(): Promise<IncomeEntry[]> {
    const data = await AsyncStorage.getItem(INCOME_KEY);
    return data ? JSON.parse(data) : [];
  },
  async saveIncome(income: IncomeEntry) {
    const incomes = await this.getIncomes();
    incomes.push(income);
    await AsyncStorage.setItem(INCOME_KEY, JSON.stringify(incomes));
  },
  async clearIncomes() {
    await AsyncStorage.setItem(INCOME_KEY, JSON.stringify([]));
  },

  async getSavings(): Promise<TaxSavings[]> {
    const data = await AsyncStorage.getItem(SAVINGS_KEY);
    return data ? JSON.parse(data) : [];
  },
  async saveSaving(saving: TaxSavings) {
    const savings = await this.getSavings();
    savings.push(saving);
    await AsyncStorage.setItem(SAVINGS_KEY, JSON.stringify(savings));
  },

  async getSettings(): Promise<UserSettings> {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : defaultSettings;
  },
  async saveSettings(settings: UserSettings) {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};
