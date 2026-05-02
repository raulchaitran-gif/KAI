import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Search, Bell, SlidersHorizontal, ChevronDown, Utensils, Briefcase, PlayCircle, Zap } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { format } from 'date-fns';

export default function Transactions() {
  const { transactions, categories, accounts, settings } = useStore();
  const currency = settings.currency;

  const getCategoryIcon = (id: string) => {
    switch(id) {
      case 'food': return <Utensils size={20} />;
      case 'salary': return <Briefcase size={20} />;
      case 'fun': return <PlayCircle size={20} />;
      default: return <Zap size={20} />;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <header className="flex justify-between items-center bg-bg-deep/80 backdrop-blur-lg sticky top-0 p-4 -mx-4 z-40 border-b border-divider">
        <div className="flex items-center gap-3">
           <img src="https://lh3.googleusercontent.com/aida/ADBb0uhGkRcEEwLLuAMB0JF_KcXrKA6Zv6_plY6mnFLVwkGwHoZ6wkK6RZdH0zdCsiGaahWTPMtGB-8mRKwyYh-53UBKBnqmp6rvjClr81ytR59PxhrParyqH6O3xYQYOmW4EqRmMvBJvWn8uG45E1hgea7brYekEGZ3jrEFr3Pjzr8_-i_idjooU6EQNt5LF7Q1Ymd_rz2FlkoI128eAEaYE9KYr80l6wETsXmfa8L9okjZU4JdO4-tNpQDRUnvx5VDTQUcOQLGTlQDoL0" alt="KAI" className="w-10 h-10" />
           <h1 className="text-2xl font-black text-accent">KAI</h1>
        </div>
        <Bell className="text-accent" />
      </header>

      <section className="bg-bg-surface p-3 rounded-2xl border border-divider flex items-center gap-3 shadow-lg">
         <Search className="text-accent" size={20} />
         <input 
           placeholder="Search transactions..." 
           className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-text-secondary"
         />
      </section>

      <section className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
         <button className="px-5 py-2 bg-accent text-bg-deep rounded-xl text-xs font-bold">All</button>
         <button className="px-5 py-2 bg-bg-surface text-text-secondary rounded-xl text-xs font-bold border border-divider">Expenses</button>
         <button className="px-5 py-2 bg-bg-surface text-text-secondary rounded-xl text-xs font-bold border border-divider">Income</button>
         <button className="px-5 py-2 bg-bg-surface text-text-secondary rounded-xl text-xs font-bold border border-divider flex items-center gap-1">
            Category <ChevronDown size={14} />
         </button>
      </section>

      <section className="bg-bg-deep rounded-3xl border border-divider flex flex-col p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-text-secondary text-xs font-bold uppercase tracking-widest">Recent History</h2>
          <span className="text-accent text-[10px] font-bold underline cursor-pointer">VIEW ALL</span>
        </div>
        
        <div className="space-y-4">
           {/* Mocking for visual consistency with design */}
           <div className="flex items-center justify-between p-3 rounded-2xl bg-bg-surface border border-divider">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-bg-deep flex items-center justify-center text-xl">🛒</div>
                 <div>
                    <div className="text-sm font-semibold">Whole Foods</div>
                    <div className="text-[10px] text-text-secondary uppercase tracking-tighter">Today • Food</div>
                 </div>
              </div>
              <div className="text-danger font-mono font-bold">-$142.50</div>
           </div>

           {transactions.length > 0 ? (
             transactions.slice(0, 5).map(t => (
               <div key={t.id} className="flex items-center justify-between p-3 rounded-2xl bg-bg-surface border border-divider">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-bg-deep flex items-center justify-center text-xl">⚡️</div>
                     <div>
                        <div className="text-sm font-semibold">{t.note || 'Transaction'}</div>
                        <div className="text-[10px] text-text-secondary uppercase tracking-tighter">{format(new Date(t.date), 'MMM dd')} • {t.categoryId}</div>
                     </div>
                  </div>
                  <div className={cn("font-mono font-bold", t.type === 'debit' ? 'text-danger' : 'text-accent')}>
                     {t.type === 'debit' ? '-' : '+'}{formatCurrency(t.amount, currency)}
                  </div>
               </div>
             ))
           ) : (
             <div className="flex items-center justify-between p-3 rounded-2xl bg-bg-surface border border-divider">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-bg-deep flex items-center justify-center text-xl">🏢</div>
                   <div>
                      <div className="text-sm font-semibold">Initial Balance</div>
                      <div className="text-[10px] text-text-secondary uppercase tracking-tighter">Oct 24 • Income</div>
                   </div>
                </div>
                <div className="text-accent font-mono font-bold">+$2,500.00</div>
             </div>
           )}
        </div>
      </section>
    </div>
  );
}
