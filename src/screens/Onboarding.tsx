import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle, Shield, CreditCard, Landmark, Banknote } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const completeOnboarding = useStore(state => state.completeOnboarding);
  const addAccount = useStore(state => state.addAccount);
  
  // Profile Form State
  const [userName, setUserName] = useState('');
  
  // Account Form State
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<'bank' | 'cash'>('bank');
  const [balance, setBalance] = useState('');
  const [currency, setCurrencyLocal] = useState('USD');

  const nextStep = () => {
    if (step === 2 && !userName.trim()) {
      alert('Please enter your name to continue');
      return;
    }
    setStep(s => s + 1);
  };

  const handleCreateFirstAccount = () => {
    if (!accountName.trim() || !balance.trim()) {
      alert('Please provide account details');
      return;
    }
    addAccount({
      name: accountName,
      type: accountType,
      balance: parseFloat(balance) || 0,
      currency,
    });
    completeOnboarding(userName, currency);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary px-4 py-8 no-scrollbar">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-12"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-[80px]" />
              <img 
                src="https://lh3.googleusercontent.com/aida/ADBb0uhGkRcEEwLLuAMB0JF_KcXrKA6Zv6_plY6mnFLVwkGwHoZ6wkK6RZdH0zdCsiGaahWTPMtGB-8mRKwyYh-53UBKBnqmp6rvjClr81ytR59PxhrParyqH6O3xYQYOmW4EqRmMvBJvWn8uG45E1hgea7brYekEGZ3jrEFr3Pjzr8_-i_idjooU6EQNt5LF7Q1Ymd_rz2FlkoI128eAEaYE9KYr80l6wETsXmfa8L9okjZU4JdO4-tNpQDRUnvx5VDTQUcOQLGTlQDoL0" 
                alt="KAI Logo"
                className="w-48 h-48 relative z-10"
              />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-white mb-2">KAI</h1>
              <p className="text-text-secondary text-lg px-6">Master your money with precision and clarity.</p>
            </div>
            
            <div className="w-full max-w-xs pt-12">
              <button 
                onClick={nextStep}
                className="w-full py-4 bg-accent text-bg-deep font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                Get Started <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="feature"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center pt-12"
          >
            <div className="w-full max-w-sm mb-12 bg-bg-deep rounded-2xl overflow-hidden border border-divider shadow-2xl p-8 flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-full flex items-center justify-center mb-8" style={{ background: 'conic-gradient(#89E900 0deg 240deg, #2E2E2E 240deg 360deg)' }}>
                <div className="w-36 h-36 bg-bg-deep rounded-full flex flex-col items-center justify-center text-center px-4">
                  <span className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Global View</span>
                  <span className="text-xl font-bold text-white leading-tight">All Wallets in One Place</span>
                </div>
              </div>
            </div>

            <div className="text-center max-w-xs space-y-4 mb-20">
              <h2 className="text-3xl font-bold">Total Control</h2>
              <p className="text-text-secondary">Track your accounts, history, and budgets with zero effort. Everything is optimized for your rhythm.</p>
            </div>

            <button 
              onClick={nextStep}
              className="w-full py-4 bg-accent text-bg-deep font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Continue <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-center gap-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">What's your name?</h2>
              <p className="text-text-secondary italic">Your financial identity starts here.</p>
            </div>
            
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="e.g. Alex"
                autoFocus
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-bg-deep border border-divider p-5 rounded-2xl text-2xl font-bold focus:border-accent outline-none text-white transition-all shadow-xl"
              />
            </div>

            <button 
              onClick={nextStep}
              className="w-full py-4 bg-accent text-bg-deep font-bold rounded-xl flex items-center justify-center gap-2 mt-4 active:scale-95 transition-transform"
            >
              Next <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="account"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col pt-4 overflow-hidden"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-1">First Account</h1>
              <p className="text-text-secondary text-sm">Add your main wallet or bank account.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase ml-1">Account Label</label>
                 <input 
                   type="text" 
                   placeholder="e.g. PayPal, Cash, Wells Fargo"
                   value={accountName}
                   onChange={(e) => setAccountName(e.target.value)}
                   className="w-full bg-bg-deep border border-divider p-4 rounded-xl focus:border-accent outline-none text-white text-lg"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase ml-1">Account Type</label>
                 <div className="grid grid-cols-2 gap-3">
                   <button 
                     onClick={() => setAccountType('bank')}
                     className={cn("p-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all", accountType === 'bank' ? "border-accent bg-accent/10 text-accent shadow-lg" : "border-divider bg-bg-deep text-text-secondary")}
                   >
                     <Landmark size={18} /> BANK
                   </button>
                   <button 
                     onClick={() => setAccountType('cash')}
                     className={cn("p-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all", accountType === 'cash' ? "border-accent bg-accent/10 text-accent shadow-lg" : "border-divider bg-bg-deep text-text-secondary")}
                   >
                     <Banknote size={18} /> CASH
                   </button>
                 </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase ml-1">Global Currency</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['USD', 'EUR', 'GBP', 'GYD'].map((cur) => (
                      <button
                        key={cur}
                        onClick={() => setCurrencyLocal(cur)}
                        className={cn(
                          "py-3 rounded-xl border text-xs font-bold transition-all",
                          currency === cur 
                            ? "bg-accent text-bg-deep border-accent shadow-md scale-105" 
                            : "bg-bg-deep text-text-secondary border-divider hover:border-accent/40"
                        )}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-secondary tracking-widest uppercase ml-1">Starting Balance</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-black text-xl">
                      {currency === 'GYD' ? 'G$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
                    </span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className="w-full bg-bg-deep border border-divider p-5 pl-14 rounded-2xl text-4xl font-black focus:border-accent outline-none text-white shadow-xl"
                    />
                  </div>
               </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={handleCreateFirstAccount}
                className="w-full py-5 bg-accent text-bg-deep font-bold rounded-2xl flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-transform"
              >
                <CheckCircle size={24} /> Launch Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
