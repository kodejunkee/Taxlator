import { Currency } from './income';

export type ExchangeRates = Record<Currency, number>;

export interface UserSettings {
  preferredCurrency: Currency;
  exchangeRates: ExchangeRates;
}
