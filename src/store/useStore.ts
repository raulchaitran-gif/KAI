import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AccountType = 'bank' | 'cash' | 'credit';
export type TransactionType = 'debit' | 'credit';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  lastFour?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  note: string;
  date: string;
  isRecurring: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetLimit: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  period: 'monthly' | 'weekly';
  spent: number;
}

interface KaiState {
  hasOnboarded: boolean;
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  settings: {
    currency: string;
    language: 'en' | 'es';
    darkMode: boolean;
  };
  
  // Actions
  completeOnboarding: () => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  setCurrency: (currency: string) => void;
  clearData: () => void;
}

export const useStore = create<KaiState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      accounts: [],
      transactions: [],
      categories: [
        { id: 'food', name: 'Food', icon: 'restaurant', color: '#89E900', budgetLimit: 600 },
        { id: 'rent', name: 'Rent', icon: 'home', color: '#89E900', budgetLimit: 1200 },
        { id: 'travel', name: 'Travel', icon: 'flight', color: '#89E900', budgetLimit: 800 },
        { id: 'health', name: 'Health', icon: 'medical_services', color: '#89E900', budgetLimit: 500 },
        { id: 'shop', name: 'Shop', icon: 'shopping_bag', color: '#89E900', budgetLimit: 400 },
        { id: 'transport', name: 'Transport', icon: 'directions_car', color: '#89E900', budgetLimit: 300 },
        { id: 'fun', name: 'Fun', icon: 'movie', color: '#89E900', budgetLimit: 200 },
        { id: 'other', name: 'Other', icon: 'more_horiz', color: '#89E900', budgetLimit: 100 },
      ],
      settings: {
        currency: 'USD',
        language: 'en',
        darkMode: true,
      },
      
      completeOnboarding: () => set({ hasOnboarded: true }),
      
      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, { ...account, id: Math.random().toString(36).substr(2, 9) }]
      })),
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [
          { ...transaction, id: Math.random().toString(36).substr(2, 9) },
          ...state.transactions
        ]
      })),

      setCurrency: (currency) => set((state) => ({
        settings: { ...state.settings, currency },
        accounts: state.accounts.map(acc => ({ ...acc, currency })) // Update existing accounts legacy
      })),
      
      clearData: () => set({
        accounts: [],
        transactions: [],
        hasOnboarded: false
      }),
    }),
    {
      name: 'kai-storage',
    }
  )
);
