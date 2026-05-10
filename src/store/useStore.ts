import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AccountType = 'bank' | 'savings' | 'investment' | 'cash' | 'credit';
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
  frequency?: 'weekly' | 'monthly' | 'yearly';
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

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  color: string;
}

interface KaiState {
  userName: string;
  hasOnboarded: boolean;
  activeTab: 'accounts' | 'dashboard' | 'transactions' | 'settings' | 'account-detail';
  selectedAccountId: string | null;
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  settings: {
    currency: string;
    language: 'en' | 'es';
    darkMode: boolean;
  };
  lastRecurringCheck?: string;
  
  // Actions
  completeOnboarding: (userName: string, currency: string) => void;
  setActiveTab: (tab: 'accounts' | 'dashboard' | 'transactions' | 'settings' | 'account-detail') => void;
  setSelectedAccountId: (id: string | null) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  processRecurringTransactions: () => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, amount: number) => void;
  setCurrency: (currency: string) => void;
  updateCategoryBudget: (id: string, limit: number) => void;
  clearData: () => void;
}

export const useStore = create<KaiState>()(
  persist(
    (set, get) => ({
      userName: '',
      hasOnboarded: false,
      activeTab: 'dashboard',
      selectedAccountId: null,
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
        { id: 'salary', name: 'Salary', icon: 'payments', color: '#89E900', budgetLimit: 0 },
        { id: 'bonus', name: 'Bonus', icon: 'stars', color: '#89E900', budgetLimit: 0 },
        { id: 'other', name: 'Other', icon: 'more_horiz', color: '#89E900', budgetLimit: 100 },
      ],
      goals: [],
      settings: {
        currency: 'USD',
        language: 'en',
        darkMode: true,
      },
      lastRecurringCheck: undefined,
      
      setActiveTab: (activeTab) => set({ activeTab }),
      setSelectedAccountId: (selectedAccountId) => set({ selectedAccountId }),

      completeOnboarding: (userName, currency) => set({ 
        hasOnboarded: true, 
        userName, 
        activeTab: 'dashboard',
        settings: { currency, language: 'en', darkMode: true },
        accounts: [
          { id: 'acc-1', name: 'Primary Checking', balance: 0, currency, type: 'bank' },
          { id: 'acc-2', name: 'Growth Savings', balance: 0, currency, type: 'savings' },
          { id: 'acc-3', name: 'Digital Wallet', balance: 0, currency, type: 'investment' }
        ]
      }),
      
      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, { ...account, id: Math.random().toString(36).substr(2, 9) }]
      })),
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [
          { ...transaction, id: Math.random().toString(36).substr(2, 9) },
          ...state.transactions
        ],
        accounts: state.accounts.map(acc => 
          acc.id === transaction.accountId 
            ? { ...acc, balance: acc.balance + (transaction.type === 'credit' ? transaction.amount : -transaction.amount) }
            : acc
        )
      })),

      processRecurringTransactions: () => {
        const state = get();
        const now = new Date();
        const lastCheck = state.lastRecurringCheck ? new Date(state.lastRecurringCheck) : new Date(0);
        
        // Run once per hour
        if (now.getTime() - lastCheck.getTime() < 3600000) return;

        const recurringTemplates = state.transactions.filter(t => t.isRecurring && t.frequency);
        const newTransactions: Transaction[] = [];
        let updatedAccounts = [...state.accounts];

        recurringTemplates.forEach(template => {
          const lastTx = state.transactions
            .filter(t => t.note === template.note && t.categoryId === template.categoryId && t.accountId === template.accountId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

          if (!lastTx) return;

          const lastDate = new Date(lastTx.date);
          let nextDate = new Date(lastDate);

          if (template.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
          else if (template.frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
          else if (template.frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);

          if (now >= nextDate) {
            const newTx = {
              ...template,
              id: Math.random().toString(36).substr(2, 9),
              date: nextDate.toISOString(),
            };
            newTransactions.push(newTx);
            updatedAccounts = updatedAccounts.map(acc => 
              acc.id === newTx.accountId 
                ? { ...acc, balance: acc.balance + (newTx.type === 'credit' ? newTx.amount : -newTx.amount) }
                : acc
            );
          }
        });

        if (newTransactions.length > 0) {
          set({ 
            transactions: [...newTransactions, ...state.transactions],
            accounts: updatedAccounts,
            lastRecurringCheck: now.toISOString()
          });
          // Fire notification for recurring transactions (dynamic import to avoid SSR issues)
          import('../lib/notifications').then(({ notifyRecurringProcessed }) => {
            notifyRecurringProcessed(newTransactions.map(t => ({
              note: t.note,
              amount: t.amount,
              currency: state.settings.currency,
            })));
          });
        } else {
          set({ lastRecurringCheck: now.toISOString() });
        }
      },

      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: Math.random().toString(36).substr(2, 9) }]
      })),

      updateGoal: (id, amount) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g)
      })),

      updateCategoryBudget: (id, limit) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, budgetLimit: limit } : c)
      })),

      setCurrency: (currency) => set((state) => ({
        settings: { ...state.settings, currency },
        accounts: state.accounts.map(acc => ({ ...acc, currency })) // Update existing accounts legacy
      })),
      
      clearData: () => set({
        accounts: [],
        transactions: [],
        goals: [],
        hasOnboarded: false
      }),
    }),
    {
      name: 'kai-storage',
    }
  )
);
