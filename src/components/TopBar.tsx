import React from 'react';
import { useStore } from '../store/useStore';
import { Search, Bell, TrendingUp, TrendingDown, Diamond } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function TopBar() {
  const { transactions, setActiveTab } = useStore();
  
  // Calculate flow status
  const now = new Date();
  const monthTxs = transactions.filter(t => {
    const txDate = new Date(t.date);
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
  });
  
  const income = monthTxs.filter(t => t.type === 'credit').reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = monthTxs.filter(t => t.type === 'debit').reduce((acc, curr) => acc + curr.amount, 0);
  const isPositive = income >= expenses;

  return (
    <header className="fixed top-0 inset-x-0 z-[50]">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-accent h-10 flex items-center justify-between px-6 shadow-xl"
      >
        {/* Left Section: Logo & Date */}
        <div className="flex items-center gap-4">
          <div 
             onClick={() => setActiveTab('dashboard')}
             className="w-8 h-8 bg-bg-deep rounded-lg flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
             <img src="https://lh3.googleusercontent.com/aida/ADBb0uhGkRcEEwLLuAMB0JF_KcXrKA6Zv6_plY6mnFLVwkGwHoZ6wkK6RZdH0zdCsiGaahWTPMtGB-8mRKwyYh-53UBKBnqmp6rvjClr81ytR59PxhrParyqH6O3xYQYOmW4EqRmMvBJvWn8uG45E1hgea7brYekEGZ3jrEFr3Pjzr8_-i_idjooU6EQNt5LF7Q1Ymd_rz2FlkoI128eAEaYE9KYr80l6wETsXmfa8L9okjZU4JdO4-tNpQDRUnvx5VDTQUcOQLGTlQDoL0" alt="K" className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-bg-deep/60 uppercase tracking-tighter leading-none">{format(now, 'MMM dd,')}</span>
            <span className="text-[10px] font-black text-bg-deep uppercase tracking-tighter leading-none">{format(now, 'yyyy')}</span>
          </div>
        </div>

        {/* Center Section: Status Pill */}
        <div className="bg-bg-deep/10 rounded-full px-3 py-0.5 flex items-center gap-1.5 border border-bg-deep/5">
          <span className="text-[9px] font-black text-bg-deep tracking-tight">
            {isPositive ? '+ POSITIVE' : '- DEFICIT'}
          </span>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-1">
           <button 
             onClick={() => setActiveTab('transactions')}
             className="p-1.5 text-bg-deep active:scale-90 transition-transform"
           >
             <Search size={18} className="stroke-[3]" />
           </button>
           <button 
             onClick={() => setActiveTab('transactions')}
             className="relative p-1.5 text-bg-deep active:scale-90 transition-transform"
           >
             <Bell size={18} className="stroke-[3]" />
             <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-danger rounded-full border border-accent" />
           </button>
        </div>
      </motion.div>
    </header>
  );
}
