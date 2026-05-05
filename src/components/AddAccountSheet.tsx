import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, Wallet, PiggyBank, CreditCard, Landmark, Coins } from 'lucide-react';
import { useStore, AccountType } from '../store/useStore';
import { cn } from '../lib/utils';

interface AddAccountSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const accountTypes: { id: AccountType; label: string; icon: any }[] = [
  { id: 'bank', label: 'Checking', icon: Building2 },
  { id: 'savings', label: 'Savings', icon: PiggyBank },
  { id: 'investment', label: 'Investment', icon: Landmark },
  { id: 'cash', label: 'Cash', icon: Coins },
  { id: 'credit', label: 'Credit Card', icon: CreditCard },
];

export default function AddAccountSheet({ isOpen, onClose }: AddAccountSheetProps) {
  const { addAccount, settings } = useStore();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState<AccountType>('bank');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || isNaN(parseFloat(balance))) return;

    addAccount({
      name,
      type,
      balance: parseFloat(balance),
      currency: settings.currency,
    });
    
    // Reset and close
    setName('');
    setBalance('');
    setType('bank');
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 bg-[#121212] border-t border-white/10 rounded-t-[40px] z-[101] p-8 pb-12 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight">Add Account</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Account Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chase Checking"
                  className="bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-accent/40 transition-all text-lg"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Initial Balance</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-white/20 select-none">
                    {settings.currency === 'USD' ? '$' : settings.currency}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-black placeholder:text-white/10 focus:outline-none focus:border-accent/40 transition-all text-2xl tabular-nums"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Account Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {accountTypes.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setType(item.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-3 p-4 rounded-3xl border transition-all aspect-square",
                          type === item.id 
                            ? "bg-accent/10 border-accent text-accent shadow-[0_0_20px_rgba(137,233,0,0.1)]" 
                            : "bg-white/5 border-white/5 text-white/40 grayscale hover:grayscale-0 hover:border-white/10"
                        )}
                      >
                        <Icon size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="bg-accent text-bg-primary py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_rgba(137,233,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
              >
                Create Account
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
