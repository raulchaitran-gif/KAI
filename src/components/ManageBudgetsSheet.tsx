import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, TrendingUp, AlertCircle } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

interface ManageBudgetsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageBudgetsSheet({ isOpen, onClose }: ManageBudgetsSheetProps) {
  const { categories, updateCategoryBudget, settings } = useStore();
  const [localBudgets, setLocalBudgets] = useState<Record<string, number>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.budgetLimit }), {})
  );

  const expenseCategories = categories.filter(c => !['salary', 'bonus'].includes(c.id));

  const handleSave = () => {
    Object.entries(localBudgets).forEach(([id, limit]) => {
      updateCategoryBudget(id, Number(limit));
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[70] bg-bg-deep rounded-t-[32px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
          >
            <div className="w-full flex justify-center py-4">
              <div className="w-12 h-1.5 bg-bg-surface rounded-full" />
            </div>

            <div className="px-6 flex justify-between items-center mb-6">
               <h2 className="text-xl font-black text-white">Monthly Budgets</h2>
               <button onClick={onClose} className="p-2 text-text-secondary active:scale-90 transition-transform">
                  <X size={24} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-24 no-scrollbar">
               <div className="bg-accent/10 border border-accent/20 p-4 rounded-2xl flex gap-3">
                  <TrendingUp className="text-accent shrink-0" size={20} />
                  <p className="text-[10px] font-bold text-text-secondary leading-relaxed">
                     Setting limits helps you stay disciplined. KAI will alert you when you cross <span className="text-accent">90%</span> of your allocated budget.
                  </p>
               </div>

               {expenseCategories.map(cat => (
                 <div key={cat.id} className="bg-bg-surface/50 p-4 rounded-2xl border border-divider space-y-3">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-bg-deep flex items-center justify-center text-xl" style={{ borderLeft: `4px solid ${cat.color}` }}>
                             {cat.id === 'food' ? '🍕' : cat.id === 'rent' ? '🏠' : cat.id === 'shop' ? '🛍️' : cat.id === 'transport' ? '🚗' : cat.id === 'fun' ? '🎬' : '📦'}
                          </div>
                          <div>
                             <p className="text-[10px] font-black tracking-widest uppercase text-white">{cat.name}</p>
                             <p className="text-[8px] font-bold text-text-secondary">MONTHLY LIMIT</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="flex items-center gap-1">
                             <span className="text-sm font-black text-accent">{settings.currency === 'GYD' ? 'G$' : '$'}</span>
                             <input 
                               type="number"
                               value={localBudgets[cat.id]}
                               onChange={(e) => setLocalBudgets(prev => ({ ...prev, [cat.id]: parseFloat(e.target.value) || 0 }))}
                               className="bg-transparent border-none p-0 text-lg font-black text-white w-20 focus:ring-0 text-right"
                             />
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-6 bg-bg-deep border-t border-divider">
               <button 
                 onClick={handleSave}
                 className="w-full py-4 bg-accent text-bg-deep font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
               >
                 <Save size={20} /> SYNC BUDGETS
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
