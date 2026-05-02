import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Plus, Bell, ChevronRight, Landmark, Banknote, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function Accounts() {
  const { accounts, transactions, settings } = useStore();
  const currency = settings.currency;
  const totalNetWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="flex flex-col gap-8 pb-32">
      <header className="flex justify-between items-center bg-bg-deep/80 backdrop-blur-lg sticky top-0 p-4 -mx-4 z-40 border-b border-divider">
        <div className="flex items-center gap-3">
           <img src="https://lh3.googleusercontent.com/aida/ADBb0uhGkRcEEwLLuAMB0JF_KcXrKA6Zv6_plY6mnFLVwkGwHoZ6wkK6RZdH0zdCsiGaahWTPMtGB-8mRKwyYh-53UBKBnqmp6rvjClr81ytR59PxhrParyqH6O3xYQYOmW4EqRmMvBJvWn8uG45E1hgea7brYekEGZ3jrEFr3Pjzr8_-i_idjooU6EQNt5LF7Q1Ymd_rz2FlkoI128eAEaYE9KYr80l6wETsXmfa8L9okjZU4JdO4-tNpQDRUnvx5VDTQUcOQLGTlQDoL0" alt="KAI" className="w-10 h-10" />
           <h1 className="text-2xl font-black text-accent">KAI</h1>
        </div>
        <Bell className="text-accent" />
      </header>

      <section>
        <p className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-1">Total Net Worth</p>
        <h2 className="text-4xl font-bold text-accent tracking-tighter">{formatCurrency(totalNetWorth, currency)}</h2>
      </section>

      <section className="bg-bg-surface p-6 rounded-3xl border border-divider shadow-xl">
        <div className="flex justify-between items-end mb-8">
           <h2 className="text-text-secondary text-xs font-bold uppercase tracking-widest">My Accounts</h2>
           <button className="text-accent text-[10px] font-bold underline">VIEW ALL</button>
        </div>
        
        <div className="flex flex-col gap-4">
           {accounts.map(acc => (
             <div key={acc.id} className="p-4 bg-bg-deep rounded-2xl border-l-4 shadow-lg border-accent flex flex-col gap-2">
                <div className="flex justify-between items-start">
                   <span className="text-sm text-text-secondary font-medium tracking-tight">{acc.name}</span>
                   <span className="text-accent text-[10px] font-mono font-bold uppercase tracking-widest opacity-80">{acc.type}</span>
                </div>
                <div className="text-2xl font-bold tracking-tight">{formatCurrency(acc.balance, currency)}</div>
             </div>
           ))}

           <button className="w-full py-4 bg-accent text-bg-primary font-bold rounded-2xl text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              <Plus size={20} className="stroke-[3]" /> NEW ACCOUNT
           </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold">Quick Insights</h3>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-bg-deep p-4 rounded-xl border border-divider flex flex-col gap-2">
              <TrendingUp className="text-accent" size={20} />
              <div>
                <p className="text-[8px] font-bold text-text-secondary uppercase">Monthly Growth</p>
                <p className="text-lg font-bold">+12.5%</p>
              </div>
           </div>
           <div className="bg-bg-deep p-4 rounded-xl border border-divider flex flex-col gap-2">
              <AlertTriangle className="text-danger" size={20} />
              <div>
                <p className="text-[8px] font-bold text-text-secondary uppercase">High Spending</p>
                <p className="text-lg font-bold">Dining Out</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
