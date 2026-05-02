import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle, Shield, CreditCard, Landmark, Banknote } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const completeOnboarding = useStore(state => state.completeOnboarding);
  const addAccount = useStore(state => state.addAccount);
  
  // Account Form State
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<'bank' | 'cash'>('bank');
  const [balance, setBalance] = useState('');
  const globalCurrency = useStore(state => state.settings.currency);
  const [currency, setCurrencyLocal] = useState(globalCurrency);

  const nextStep = () => setStep(s => s + 1);

  const handleCreateFirstAccount = () => {
    addAccount({
      name: accountName || 'Main Wallet',
      type: accountType,
      balance: parseFloat(balance) || 0,
      currency,
      lastFour: '4412'
    });
    completeOnboarding();
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary px-4 py-8">
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
              <p className="text-text-secondary text-lg">Master your money with precision</p>
            </div>
            
            <div className="w-full max-w-xs space-y-4 pt-12">
              <button 
                onClick={nextStep}
                className="w-full py-4 bg-accent text-bg-deep font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                Next <ArrowRight size={20} />
              </button>
              <button 
                onClick={completeOnboarding}
                className="w-full py-2 text-text-secondary font-semibold"
              >
                Skip for now
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
                <div className="w-36 h-36 bg-bg-deep rounded-full flex flex-col items-center justify-center">
                  <span className="text-xs text-text-secondary uppercase">Spent</span>
                  <span className="text-3xl font-bold text-accent">$2,840</span>
                  <span className="text-[10px] text-text-secondary opacity-50">This Month</span>
                </div>
              </div>
              <div className="w-full space-y-4">
                <div className="p-3 bg-bg-surface rounded-xl border border-divider flex items-center gap-3">
                  <Shield size={18} className="text-accent" />
                  <span className="text-xs font-semibold">SMART SYNC</span>
                </div>
              </div>
            </div>

            <div className="text-center max-w-xs space-y-4 mb-20">
              <h2 className="text-3xl font-bold">Smart Dashboard</h2>
              <p className="text-text-secondary">Visualize your spending habits with intuitive charts and real-time budget tracking.</p>
            </div>

            <button 
              onClick={nextStep}
              className="w-full py-4 bg-accent text-bg-deep font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Get Started <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="account"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-10">
              <h1 className="text-3xl font-bold mb-2">Add your first account</h1>
              <p className="text-text-secondary">Let's get your finances organized. Start by linking a bank account or adding your cash balance.</p>
            </div>

            <div className="space-y-8">
               <div className="relative h-40 bg-bg-deep rounded-2xl border border-divider p-6 flex flex-col justify-end overflow-hidden">
                 <div className="absolute top-0 right-0 opacity-10 translate-x-4 -translate-y-4">
                    <Landmark size={120} className="text-accent" />
                 </div>
                 <div className="space-y-2">
                   <p className="text-[10px] font-bold text-accent tracking-widest uppercase">Setup Progress</p>
                   <div className="flex gap-2">
                     <div className="h-1.5 w-12 bg-accent rounded-full" />
                     <div className="h-1.5 w-12 bg-bg-surface rounded-full" />
                     <div className="h-1.5 w-12 bg-bg-surface rounded-full" />
                   </div>
                 </div>
               </div>

               <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-text-secondary tracking-widest uppercase">Account Name</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Main Checking"
                     value={accountName}
                     onChange={(e) => setAccountName(e.target.value)}
                     className="w-full bg-bg-deep border border-divider p-4 rounded-xl focus:border-accent outline-none transition-colors"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-xs font-bold text-text-secondary tracking-widest uppercase">Account Type</label>
                   <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => setAccountType('bank')}
                       className={cn("p-4 rounded-xl border flex items-center justify-center gap-2", accountType === 'bank' ? "border-accent bg-accent/10 text-accent" : "border-divider bg-bg-deep text-text-secondary")}
                     >
                       <Landmark size={18} /> Bank
                     </button>
                     <button 
                       onClick={() => setAccountType('cash')}
                       className={cn("p-4 rounded-xl border flex items-center justify-center gap-2", accountType === 'cash' ? "border-accent bg-accent/10 text-accent" : "border-divider bg-bg-deep text-text-secondary")}
                     >
                       <Banknote size={18} /> Cash
                     </button>
                   </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary tracking-widest uppercase">Currency</label>
                    <div className="flex gap-2">
                      {['USD', 'GYD', 'EUR', 'GBP'].map((cur) => (
                        <button
                          key={cur}
                          onClick={() => setCurrencyLocal(cur)}
                          className={cn(
                            "px-4 py-2 rounded-lg border text-xs font-bold transition-all",
                            currency === cur 
                              ? "bg-accent text-bg-deep border-accent scale-105" 
                              : "bg-bg-deep text-text-secondary border-divider hover:border-accent/40"
                          )}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary tracking-widest uppercase">Initial Balance</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold">
                        {currency === 'GYD' ? 'G$' : '$'}
                      </span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        className="w-full bg-bg-deep border border-divider p-4 pl-12 rounded-xl text-3xl font-bold focus:border-accent outline-none"
                      />
                    </div>
                 </div>
               </div>
            </div>

            <div className="mt-auto pt-8">
              <button 
                onClick={handleCreateFirstAccount}
                className="w-full py-5 bg-accent text-bg-deep font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <CheckCircle size={24} /> Save Account
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
