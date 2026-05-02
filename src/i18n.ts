import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "tabs": {
        "accounts": "Accounts",
        "dashboard": "Dashboard",
        "transactions": "Transactions",
        "settings": "Settings"
      },
      "dashboard": {
        "welcome": "Welcome back",
        "hello": "Hello,",
        "total_balance": "TOTAL BALANCE",
        "income": "INCOME",
        "spent": "SPENT",
        "spending_breakdown": "Spending Breakdown",
        "monthly_flow": "Monthly Flow",
        "weekly_performance": "Weekly Performance",
        "budget_limits": "Budget Limits",
        "manage_all": "MANAGE ALL"
      },
      "accounts": {
        "net_worth": "TOTAL NET WORTH",
        "your_accounts": "Your Accounts",
        "view_all": "VIEW ALL",
        "add_account": "Add Account",
        "last_transaction": "LAST TRANSACTION"
      },
      "transactions": {
        "search_placeholder": "Search transactions...",
        "all": "All",
        "expenses": "Expenses",
        "income": "Income",
        "category": "Category",
        "today": "TODAY",
        "yesterday": "YESTERDAY"
      },
      "settings": {
        "preferences": "PREFERENCES",
        "dark_mode": "Dark Mode",
        "app_lock": "App Lock",
        "pin_security": "PIN Security",
        "notifications": "Notifications",
        "data_management": "DATA MANAGEMENT",
        "export_csv": "Export CSV",
        "export_pdf": "Export PDF",
        "clear_data": "Clear Data",
        "currency": "CURRENCY"
      },
      "onboarding": {
        "title": "KAI",
        "tagline": "Master your money with precision",
        "next": "Next",
        "skip": "Skip for now",
        "get_started": "Get Started",
        "first_account_title": "Add your first account",
        "first_account_desc": "Let's get your finances organized. Start by linking a bank account or adding your cash balance."
      }
    }
  },
  es: {
    translation: {
      "tabs": {
        "accounts": "Cuentas",
        "dashboard": "Panel",
        "transactions": "Transacciones",
        "settings": "Ajustes"
      }
      // Add ES translations if needed
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
