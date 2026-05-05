import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Search, Bell, SlidersHorizontal, ChevronDown, Utensils, Briefcase, PlayCircle, Zap } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { format } from 'date-fns';

export default function Transactions() {
  const { transactions, settings, userName } = useStore();
  const currency = settings.currency;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'debit' | 'credit'>('all');

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.note?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.categoryId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeFilter === 'all' || t.type === activeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col gap-6 pb-24 no-scrollbar scroll-smooth">
      <section className="bg-bg-surface p-3 rounded-2xl border border-divider flex items-center gap-3 shadow-xl focus-within:border-accent transition-colors">
         <Search className="text-accent" size={20} />
         <input 
           placeholder="Search transactions..." 
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-text-secondary text-white focus:ring-0"
         />
      </section>

      <section className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 scroll-smooth">
         <button 
           onClick={() => setActiveFilter('all')}
           className={cn(
             "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-tighter shadow-lg active:scale-95 transition-transform",
             activeFilter === 'all' ? "bg-accent text-bg-deep" : "bg-bg-surface text-text-secondary border border-divider"
           )}
         >All</button>
         <button 
           onClick={() => setActiveFilter('debit')}
           className={cn(
             "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-tighter shadow-lg active:scale-95 transition-transform",
             activeFilter === 'debit' ? "bg-accent text-bg-deep" : "bg-bg-surface text-text-secondary border border-divider"
           )}
         >Expenses</button>
         <button 
           onClick={() => setActiveFilter('credit')}
           className={cn(
             "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-tighter shadow-lg active:scale-95 transition-transform",
             activeFilter === 'credit' ? "bg-accent text-bg-deep" : "bg-bg-surface text-text-secondary border border-divider"
           )}
         >Income</button>
      </section>

      <section className="bg-bg-deep rounded-3xl border border-divider flex flex-col p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
             <h2 className="text-text-secondary text-xs font-black uppercase tracking-widest">Complete History</h2>
             <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{filteredTransactions.length}</span>
          </div>
          <span className="text-accent text-[8px] font-bold tracking-[0.2em] border border-accent/30 px-2 py-0.5 rounded-full uppercase">Live Sync</span>
        </div>
        
        <div className="space-y-4">
           {filteredTransactions.length > 0 ? (
             filteredTransactions.map(t => (
               <div key={t.id} className="flex items-center justify-between p-3 rounded-2xl bg-bg-surface border border-divider shadow-md active:scale-[0.98] transition-transform">
                  <div className="flex items-center gap-3 min-w-0">
                     <div className="w-10 h-10 shrink-0 rounded-xl bg-bg-deep flex items-center justify-center text-xl shadow-inner group">
                        {t.type === 'debit' ? '💸' : '💰'}
                     </div>
                     <div className="min-w-0">
                        <div className="flex items-center gap-2">
                           <div className="text-sm font-semibold truncate">{t.note || 'Adjustment'}</div>
                           {t.isRecurring && (
                             <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_5px_#89E900]" title="Recurring Payment" />
                           )}
                        </div>
                        <div className="text-[10px] text-text-secondary uppercase tracking-tighter font-bold">{format(new Date(t.date), 'MMM dd')} • {t.categoryId}</div>
                     </div>
                  </div>
                  <div className={cn("font-mono font-black shrink-0 ml-4", t.type === 'debit' ? 'text-danger' : 'text-accent')}>
                     {t.type === 'debit' ? '-' : '+'}{formatCurrency(t.amount, currency)}
                  </div>
               </div>
             ))
           ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center gap-4 bg-bg-surface/30 rounded-3xl border-2 border-dashed border-divider">
                 <Zap className="text-bg-surface opacity-20" size={48} />
                 <div>
                    <h3 className="text-lg font-bold text-text-secondary">No Records Found</h3>
                    <p className="text-xs text-text-secondary opacity-50 px-4">Adjust your search or filters to see more activity.</p>
                 </div>
              </div>
           )}
        </div>
      </section>
    </div>
  );
}
