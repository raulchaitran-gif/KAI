import React from 'react';
import { useStore } from '../store/useStore';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  PiggyBank,
  Wallet,
  CreditCard,
  Rocket,
  Coins
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';

export default function AccountDetail() {
  const { 
    selectedAccountId, 
    accounts, 
    transactions, 
    categories, 
    settings, 
    setActiveTab, 
    setSelectedAccountId 
  } = useStore();
  const currency = settings.currency;

  const account = accounts.find(a => a.id === selectedAccountId);
  
  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <p className="text-white/40 font-bold mb-4">Account not found</p>
        <button 
          onClick={() => setActiveTab('accounts')}
          className="bg-accent text-bg-primary px-6 py-2 rounded-xl font-black uppercase text-xs tracking-widest"
        >
          Go Back
        </button>
      </div>
    );
  }

  const accountTransactions = transactions.filter(t => t.accountId === account.id);

  const getAccountIcon = (type: string, name: string) => {
    if (name.includes('Growth')) return <Rocket />;
    switch (type) {
      case 'bank': return <Building2 />;
      case 'savings': return <PiggyBank />;
      case 'investment': return <Wallet />;
      case 'cash': return <Coins />;
      default: return <CreditCard />;
    }
  };

  const [wholePart, decimalPart] = formatCurrency(account.balance, currency).split('.');

  return (
    <div className="flex flex-col gap-6 pb-24 no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => {
            setSelectedAccountId(null);
            setActiveTab('accounts');
          }}
          className="w-10 h-10 bg-bg-surface/30 rounded-xl flex items-center justify-center text-white/60 border border-white/5 active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-lg font-black text-white/90 tracking-tight">Account Detail</h3>
        <button className="w-10 h-10 bg-bg-surface/30 rounded-xl flex items-center justify-center text-white/60 border border-white/5 active:scale-95 transition-transform">
          <Filter size={20} />
        </button>
      </div>

      {/* Account Info Card */}
      <section className="bg-[#1C1C1C] p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="w-16 h-16 bg-bg-deep rounded-2xl flex items-center justify-center text-accent/80 border border-white/5 shadow-xl mb-6">
          {getAccountIcon(account.type, account.name)}
        </div>

        <p className="text-[12px] font-black text-white/30 tracking-[0.3em] mb-2 uppercase">{account.name}</p>
        
        <div className="flex items-baseline mb-8">
           <span className="text-[44px] font-black text-accent tracking-tighter">
             {wholePart}
           </span>
           <span className="text-2xl font-black text-accent/40 ml-1">
             .{decimalPart || '00'}
           </span>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
           <div className="bg-[#262626] p-4 rounded-2xl border border-white/5 flex flex-col gap-1 items-center">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Inflow</span>
              <div className="flex items-center gap-1.5 text-accent">
                <TrendingUp size={12} className="stroke-[3]" />
                <span className="text-sm font-black">$4,250</span>
              </div>
           </div>
           <div className="bg-[#262626] p-4 rounded-2xl border border-white/5 flex flex-col gap-1 items-center">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Outflow</span>
              <div className="flex items-center gap-1.5 text-orange-400">
                <TrendingDown size={12} className="stroke-[3]" />
                <span className="text-sm font-black">$2,110</span>
              </div>
           </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="relative group px-1">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-colors">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search transactions..."
          className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-accent/40 transition-all shadow-xl"
        />
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-xl font-black text-white/90 tracking-tight">Recent Activity</h3>
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{accountTransactions.length} Transactions</span>
        </div>

        <div className="flex flex-col gap-3">
          {accountTransactions.length > 0 ? (
            accountTransactions.map((tx, idx) => {
              const category = categories.find(c => c.id === tx.categoryId);
              const isCredit = tx.type === 'credit';
              
              return (
                <motion.div 
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#1C1C1C] rounded-2xl border border-white/5 p-4 flex items-center justify-between shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-bg-deep rounded-xl flex items-center justify-center border border-white/5 shadow-lg relative">
                      <span className="material-symbols-outlined text-primary text-xl" style={{ color: category?.color }}>
                        {category?.icon || 'payments'}
                      </span>
                      <div className={cn(
                        "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1C1C1C] shadow-sm",
                        isCredit ? "bg-accent/20 text-accent" : "bg-orange-400/20 text-orange-400"
                      )}>
                        {isCredit ? <ArrowDownLeft size={10} className="stroke-[4]" /> : <ArrowUpRight size={10} className="stroke-[4]" />}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white tracking-tight leading-none">{tx.note}</h4>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.1em] mt-1.5">
                        {category?.name} • {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={cn(
                      "text-base font-black tabular-nums tracking-tighter leading-none",
                      isCredit ? "text-accent" : "text-white"
                    )}>
                      {isCredit ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-[#1C1C1C] rounded-2xl border border-white/5 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-bg-deep rounded-full flex items-center justify-center text-white/10 mb-4">
                <Search size={32} />
              </div>
              <p className="text-sm font-bold text-white/20">No transactions recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
