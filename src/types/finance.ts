// src/types/finance.ts

export type TransactionType = 'income' | 'expense' | 'initial';
export type TimeRangeType = '7d' | '30d' | '3m' | '6m' | '1y' | 'all';

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface Transaction {
  id: number;
  amount: number;
  category: string | TransactionType;
  date: string;
  currency: string;
}

export const TRANSACTION_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Income',
  'Others'
] as const;

export type CategoryType = typeof TRANSACTION_CATEGORIES[number];

export interface ChartDataPoint {
  month: string;
  amount: number;
}

export interface CategoryDataPoint {
  name: string;
  amount: number;
}