import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Building2, 
  PiggyBank, 
  Wallet, 
  ArrowUpRight, 
  Zap, 
  Clock,
  LineChart,
  ShieldCheck,
  TrendingUp,
  Rocket,
  CreditCard,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';
import AddAccountSheet from '../components/AddAccountSheet';

export default function Accounts() {
  const { accounts, settings, setActiveTab, setSelectedAccountId } = useStore();
  const [isAddAccountOpen, setIsAddAccountOpen] = React.useState(false);
  const currency = settings.currency;
  
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const cashFlowAccounts = accounts.filter(a => a.type === 'bank' || a.type === 'cash');
  const savingsAccounts = accounts.filter(a => a.type === 'savings' || a.type === 'investment');
  const cashFlowTotal = cashFlowAccounts.reduce((acc, curr) => acc + curr.balance, 0);
  const savingsTotal = savingsAccounts.reduce((acc, curr) => acc + curr.balance, 0);

  const handleAccountClick = (id: string) => {
    setSelectedAccountId(id);
    setActiveTab('account-detail');
  };

  const getAccountIcon = (type: string, name: string) => {
    if (name.includes('Growth')) return <Rocket size={20} className="text-white/60" />;
    switch (type) {
      case 'bank': return <Building2 size={20} className="text-white/60" />;
      case 'savings': return <PiggyBank size={20} className="text-white/60" />;
      case 'investment': return <Wallet size={20} className="text-white/60" />;
      default: return <CreditCard size={20} className="text-white/60" />;
    }
  };

  const getAccountStatus = (type: string, name: string) => {
    if (name.includes('Checking')) return { label: 'LIQUID', color: 'text-accent' };
    if (name.includes('Growth')) return { label: '4.25% APY', color: 'text-accent' };
    if (name.includes('Digital')) return { label: 'VOLATILE', color: 'text-orange-400' };
    return { label: 'STABLE', color: 'text-white/20' };
  };

  const getBankNameLabel = (name: string) => {
     if (name.includes('Checking')) return 'CHASE •• 8902';
     if (name.includes('Savings')) return 'ALLY •• 4421';
     if (name.includes('Digital')) return 'USD TETHER';
     return 'KAI VAULT';
  };

  const formattedBalance = formatCurrency(totalBalance, currency);
  const [wholePart, decimalPart] = formattedBalance.split('.');

  return (
    <div className="flex flex-col gap-6 pb-24 no-scrollbar">
      
      {/* 1. Header Metadata Row */}
      <div className="bg-[#121212] rounded-2xl border border-white/5 p-5 flex justify-between items-center shadow-lg">
        <div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Liquidity Ratio</p>
          <span className="text-base font-black text-accent tracking-tight">84% Optimal</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Next Sync</p>
          <span className="text-base font-bold text-white/50 tabular-nums">02:14 PM</span>
        </div>
      </div>

      {/* 2. Total Assets Card */}
      <section className="bg-[#1C1C1C] p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <p className="text-[12px] font-black text-white/30 tracking-[0.3em] mb-4 uppercase">Total Liquid Assets</p>
        
        <div className="flex items-baseline mb-8">
           <span className="text-[44px] font-black text-accent tracking-tighter">
             {wholePart}
           </span>
           <span className="text-2xl font-black text-accent/40 ml-1">
             .{decimalPart || '00'}
           </span>
        </div>

        <div className="flex items-center gap-6">
           <div className="bg-[#262626] px-4 py-1.5 rounded-full border border-white/5 flex items-center gap-2 shadow-inner">
              <TrendingUp size={14} className="text-accent stroke-[3]" />
              <span className="text-[11px] font-black text-accent tracking-widest">+2.4%</span>
           </div>
           <span className="text-[10px] font-black text-white/20 tracking-[0.15em] uppercase">VS LAST MONTH</span>
        </div>
      </section>

      {/* 3. Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1C1C1C] rounded-[28px] border border-white/5 p-6 flex flex-col gap-10 group shadow-xl">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-[#121212] rounded-xl flex items-center justify-center text-accent shadow-xl border border-white/5">
              <Wallet size={24} />
            </div>
            <ArrowUpRight size={20} className="text-white/10 group-hover:text-accent transition-colors" />
          </div>
          <div>
            <p className="text-[11px] font-black text-white/20 uppercase tracking-widest mb-1">Cash Flow</p>
            <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(cashFlowTotal, currency)}</p>
          </div>
        </div>

        <div className="bg-[#1C1C1C] rounded-[28px] border border-white/5 p-6 flex flex-col gap-10 group shadow-xl">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-[#121212] rounded-xl flex items-center justify-center text-accent shadow-xl border border-white/5">
               <PiggyBank size={24} />
            </div>
            <ArrowUpRight size={20} className="text-white/10 group-hover:text-accent transition-colors" />
          </div>
          <div>
            <p className="text-[11px] font-black text-white/20 uppercase tracking-widest mb-1">Savings</p>
            <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(savingsTotal, currency)}</p>
          </div>
        </div>
      </div>

      {/* 4. Accounts List */}
      <div className="flex flex-col gap-6 mt-4">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-2xl font-black text-white tracking-tight">Accounts</h3>
          <div className="flex items-center gap-4 mb-1">
            <button 
              onClick={() => setIsAddAccountOpen(true)}
              className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent hover:bg-accent/30 transition-colors"
            >
              <Plus size={18} className="stroke-[3]" />
            </button>
            <button onClick={() => setActiveTab('settings')} className="text-[11px] font-black text-accent uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">MANAGE</button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {accounts.map((acc) => {
            const status = getAccountStatus(acc.type, acc.name);
            return (
              <motion.div 
                key={acc.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAccountClick(acc.id)}
                className="bg-[#1C1C1C] rounded-[24px] border border-white/5 border-l-[6px] border-l-accent p-6 flex items-center justify-between shadow-2xl relative overflow-hidden group cursor-pointer"
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 bg-[#121212] rounded-2xl flex items-center justify-center text-white/40 border border-white/5 shadow-xl">
                    {getAccountIcon(acc.type, acc.name)}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-black text-base text-white tracking-tight">{acc.name}</h4>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.1em]">{getBankNameLabel(acc.name)}</p>
                  </div>
                </div>
                
                <div className="text-right relative z-10 flex flex-col gap-1">
                  <div className="text-xl font-black text-white tabular-nums tracking-tighter leading-none">
                    {formatCurrency(acc.balance, currency)}
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                    {status.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 5. KAI Insight Section */}
      <section className="bg-[#171D12] rounded-[40px] border border-accent/10 p-8 shadow-inner mt-2">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
             <TrendingUp size={16} className="stroke-[3]" />
           </div>
           <span className="text-[12px] font-black text-accent uppercase tracking-[0.3em]">KAI Insight</span>
        </div>
        
        <p className="text-[15px] font-medium text-white/70 leading-relaxed max-w-[90%]">
          Your liquid assets increased by <span className="text-accent font-black">$3,420</span> this week. You have enough cash to cover <span className="text-accent font-black text-lg">6.2 months</span> of typical expenses.
        </p>
        
        <div className="h-2 bg-white/10 rounded-full mt-8 overflow-hidden relative">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: '68%' }}
             transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} // smooth ease out
             className="h-full bg-accent relative" 
           >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
             <div className="absolute right-0 top-0 bottom-0 w-4 bg-accent blur-md" />
           </motion.div>
        </div>
      </section>

      <AddAccountSheet 
        isOpen={isAddAccountOpen} 
        onClose={() => setIsAddAccountOpen(false)} 
      />

    </div>
  );
}
