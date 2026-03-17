import { Currency } from './income';

export type ExchangeRates = Record<string, number>;

export interface UserSettings {
  preferredCurrency: Currency;
  exchangeRates: ExchangeRates;
  currencyUsage?: Record<string, number>;
  soundEnabled?: boolean;
}
