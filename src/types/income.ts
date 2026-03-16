export type Currency = string; // Supports all ISO 4217 codes (e.g., NGN, USD, GBP, JPY, etc.)

export interface IncomeEntry {
  id: string;
  amount: number;
  currency: Currency;
  amountNGN: number;
  description: string;
  date: string;
}

export interface TaxSavings {
  amount: number;
  date: string;
}
