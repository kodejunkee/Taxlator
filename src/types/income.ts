export type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';

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
