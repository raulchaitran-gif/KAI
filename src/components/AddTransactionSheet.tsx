import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { X, CheckCircle, Utensils, Home, Plane, Activity, ShoppingBag, Car, Film, Zap, Wallet, Calendar, Clock, Edit3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface AddTransactionSheetProps {
  onClose: () => void;
}

export default function AddTransactionSheet({ onClose }: AddTransactionSheetProps) {
  const { addTransaction, categories, accounts } = useStore();
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('food');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [note, setNote] = useState('');

  const handleSave = () => {
    addTransaction({
      amount: parseFloat(amount) || 0,
      type,
      categoryId: categoryId === 'other' ? (customCategoryName || 'Other') : categoryId,
      accountId,
      note,
      date: new Date().toISOString(),
      isRecurring: false
    });
    onClose();
  };

  const getCatIcon = (id: string) => {
    switch(id) {
      case 'food': return <Utensils size={24} />;
      case 'rent': return <Home size={24} />;
      case 'travel': return <Plane size={24} />;
      case 'health': return <Activity size={24} />;
      case 'shop': return <ShoppingBag size={24} />;
      case 'transport': return <Car size={24} />;
      case 'fun': return <Film size={24} />;
      default: return <Zap size={24} />;
    }
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-bg-deep rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] overflow-hidden"
    >
      <div className="w-full flex justify-center py-4">
        <div className="w-12 h-1.5 bg-bg-surface rounded-full" />
      </div>

      <div className="px-6 pb-6">
        <div className="flex justify-between items-center mb-8">
           <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary"><X size={24} /></button>
           <div className="flex bg-black p-1 rounded-full border border-divider">
              <button 
                onClick={() => setType('debit')}
                className={cn("px-6 py-2 rounded-full text-xs font-bold transition-all", type === 'debit' ? "bg-accent text-bg-deep" : "text-text-secondary")}
              >Expense</button>
              <button 
                onClick={() => setType('credit')}
                className={cn("px-6 py-2 rounded-full text-xs font-bold transition-all", type === 'credit' ? "bg-accent text-bg-deep" : "text-text-secondary")}
              >Income</button>
           </div>
           <div className="w-10" />
        </div>

        <div className="flex flex-col items-center py-4">
           <p className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-1">Enter Amount</p>
           <div className="flex items-baseline gap-2">
             <span className="text-3xl font-bold text-accent">$</span>
             <input 
               type="number"
               autoFocus
               placeholder="0.00"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               className="bg-transparent border-none text-center text-5xl font-bold w-full max-w-[200px] focus:ring-0 placeholder:text-bg-surface"
             />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-8 no-scrollbar">
         <section>
            <div className="flex justify-between items-center mb-4">
               <h6 className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">Select Category</h6>
            </div>
            <div className="grid grid-cols-4 gap-4">
               {categories.map(cat => (
                 <button 
                   key={cat.id}
                   onClick={() => setCategoryId(cat.id)}
                   className="flex flex-col items-center gap-2"
                 >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl border flex items-center justify-center transition-all",
                      categoryId === cat.id ? "border-accent bg-accent/10 text-accent" : "border-divider text-text-secondary"
                    )}>
                       {getCatIcon(cat.id)}
                    </div>
                    <span className={cn("text-[10px] font-bold uppercase", categoryId === cat.id ? "text-accent" : "text-text-secondary")}>{cat.name}</span>
                 </button>
               ))}
            </div>
            {categoryId === 'other' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4"
              >
                <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2 block">Custom Category Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Gift, Tax, etc."
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  className="w-full bg-black border border-divider p-3 rounded-xl focus:border-accent outline-none text-sm"
                />
              </motion.div>
            )}
         </section>

         <section>
            <h6 className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-4">Select Account</h6>
            <div className="flex flex-wrap gap-2">
               {accounts.map(acc => (
                 <button 
                   key={acc.id}
                   onClick={() => setAccountId(acc.id)}
                   className={cn(
                     "px-4 py-2 rounded-full border text-[10px] font-bold uppercase flex items-center gap-2 transition-all",
                     accountId === acc.id ? "border-accent bg-accent/10 text-accent" : "border-divider text-text-secondary"
                   )}
                 >
                    <Wallet size={14} />
                    {acc.name}
                 </button>
               ))}
            </div>
         </section>

         <section className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <p className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">Date</p>
                <div className="bg-black p-3 rounded-xl border border-divider flex items-center gap-2 text-xs">
                   <Calendar size={16} className="text-text-secondary" /> {format(new Date(), 'MMM dd, yyyy')}
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">Time</p>
                <div className="bg-black p-3 rounded-xl border border-divider flex items-center gap-2 text-xs">
                   <Clock size={16} className="text-text-secondary" /> {format(new Date(), 'HH:mm a')}
                </div>
            </div>
         </section>

         <section className="pb-8">
            <p className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">Note</p>
            <div className="bg-black p-3 rounded-xl border border-divider flex items-start gap-3">
               <Edit3 size={16} className="text-text-secondary mt-1" />
               <textarea 
                 value={note}
                 onChange={(e) => setNote(e.target.value)}
                 className="w-full bg-transparent border-none focus:ring-0 text-sm h-12" 
                 placeholder="What was this for?"
               />
            </div>
         </section>
      </div>

      <div className="p-6 bg-bg-deep border-t border-divider">
         <button 
           onClick={handleSave}
           disabled={!amount}
           className="w-full bg-accent text-bg-deep py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
         >
            <CheckCircle size={24} /> Save Transaction
         </button>
      </div>
    </motion.div>
  );
}
