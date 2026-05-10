import React, { useState } from 'react';
import { useStore } from './store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import Accounts from './screens/Accounts';
import AccountDetail from './screens/AccountDetail';
import Transactions from './screens/Transactions';
import Settings from './screens/Settings';
import AddTransactionSheet from './components/AddTransactionSheet';
import TopBar from './components/TopBar';
import { Landmark, LayoutDashboard, ReceiptText, Settings as SettingsIcon, Plus } from 'lucide-react';
import { cn } from './lib/utils';
import {
  requestNotificationPermission,
  checkBudgetAlerts,
  sendDailyTip,
  sendWelcomeNotification,
} from './lib/notifications';
import './i18n';

type Tab = 'accounts' | 'dashboard' | 'transactions' | 'settings' | 'account-detail';

export default function App() {
  const { hasOnboarded, processRecurringTransactions, activeTab, setActiveTab, userName, transactions, categories } = useStore();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  React.useEffect(() => {
    if (hasOnboarded) {
      processRecurringTransactions();

      requestNotificationPermission().then(granted => {
        if (!granted) return;
        sendDailyTip();
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const budgetAlerts = categories
          .filter(c => c.budgetLimit > 0)
          .map(c => {
            const spent = transactions
              .filter(t => t.categoryId === c.id && t.type === 'debit' && new Date(t.date) >= monthStart)
              .reduce((s, t) => s + t.amount, 0);
            return { categoryName: c.name, spent, limit: c.budgetLimit };
          });
        checkBudgetAlerts(budgetAlerts);
      });
    }
  }, [hasOnboarded]);

  React.useEffect(() => {
    if (hasOnboarded && userName) {
      const welcomed = localStorage.getItem('kai-welcomed');
      if (!welcomed) {
        localStorage.setItem('kai-welcomed', 'true');
        sendWelcomeNotification(userName);
      }
    }
  }, [hasOnboarded, userName]);

  if (!hasOnboarded) {
    return <Onboarding />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'accounts': return <Accounts />;
      case 'account-detail': return <AccountDetail />;
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'settings': return <Settings />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg-primary text-text-primary px-4 selection:bg-accent selection:text-bg-deep overflow-x-hidden">
      <TopBar />
      <main className="pt-16 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FAB */}
      <button 
        onClick={() => setIsAddSheetOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-accent text-bg-primary font-bold rounded-2xl shadow-[0_8px_24px_rgba(137,233,0,0.4)] flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Plus size={32} className="stroke-[3]" />
      </button>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-deep border-t border-divider px-6 pt-3 pb-5 flex justify-around items-center z-40 rounded-t-[24px] shadow-[0_-4px_12px_rgba(0,0,0,0.4)]">
        <NavItem 
          active={activeTab === 'accounts'} 
          onClick={() => setActiveTab('accounts')} 
          icon={<Landmark size={24} />} 
          label="Accounts" 
        />
        <NavItem 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard size={24} />} 
          label="Dashboard" 
        />
        <NavItem 
          active={activeTab === 'transactions'} 
          onClick={() => setActiveTab('transactions')} 
          icon={<ReceiptText size={24} />} 
          label="History" 
        />
        <NavItem 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
          icon={<SettingsIcon size={24} />} 
          label="Settings" 
        />
      </nav>

      <AnimatePresence>
        {isAddSheetOpen && (
          <div className="fixed inset-0 z-50">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsAddSheetOpen(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <AddTransactionSheet onClose={() => setIsAddSheetOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-200 active:scale-90",
        active ? "text-accent fill-accent" : "text-text-secondary"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
