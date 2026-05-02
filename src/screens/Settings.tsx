import { useStore } from '../store/useStore';
import { Bell, Moon, Lock, Settings as SettingsIcon, ChevronRight, FileText, Trash2 } from 'lucide-react';

export default function Settings() {
  const { clearData, settings, setCurrency } = useStore();

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearData();
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      <header className="flex justify-between items-center bg-bg-deep/80 backdrop-blur-lg sticky top-0 p-4 -mx-4 z-40 border-b border-divider">
        <div className="flex items-center gap-3">
           <img src="https://lh3.googleusercontent.com/aida/ADBb0uhGkRcEEwLLuAMB0JF_KcXrKA6Zv6_plY6mnFLVwkGwHoZ6wkK6RZdH0zdCsiGaahWTPMtGB-8mRKwyYh-53UBKBnqmp6rvjClr81ytR59PxhrParyqH6O3xYQYOmW4EqRmMvBJvWn8uG45E1hgea7brYekEGZ3jrEFr3Pjzr8_-i_idjooU6EQNt5LF7Q1Ymd_rz2FlkoI128eAEaYE9KYr80l6wETsXmfa8L9okjZU4JdO4-tNpQDRUnvx5VDTQUcOQLGTlQDoL0" alt="KAI" className="w-10 h-10" />
           <h1 className="text-2xl font-black text-accent">KAI</h1>
        </div>
        <Bell className="text-accent" />
      </header>

      <section className="grid grid-cols-3 gap-4">
         <div className="col-span-2 bg-bg-surface p-6 rounded-2xl border border-divider shadow-xl flex items-center gap-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center font-bold text-bg-deep text-2xl shadow-lg">
               AJ
            </div>
            <div>
               <h2 className="text-lg font-bold">Alex Johnson</h2>
               <p className="text-xs text-text-secondary">Premium Member</p>
            </div>
         </div>
         <div className="bg-bg-surface p-4 rounded-2xl border border-divider shadow-xl flex flex-col justify-center items-center text-center">
            <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Currency</p>
            <select 
              value={settings.currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-lg font-bold text-accent outline-none cursor-pointer"
            >
              <option value="USD">USD</option>
              <option value="GYD">GYD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
         </div>
      </section>

      <section className="space-y-4">
         <h3 className="text-[10px] font-bold text-text-secondary tracking-widest px-2 uppercase">PREFERENCES</h3>
         <div className="bg-bg-surface rounded-2xl border border-divider overflow-hidden divide-y divide-divider shadow-xl">
            <div className="p-4 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-bg-deep rounded-xl text-accent"><Moon size={20} /></div>
                  <span className="font-bold text-sm">Dark Mode</span>
               </div>
               <div className="w-12 h-6 bg-accent rounded-full relative p-1 shadow-inner">
                  <div className="w-4 h-4 bg-bg-deep rounded-full ml-auto" />
               </div>
            </div>
            <div className="p-4 flex justify-between items-center group cursor-pointer hover:bg-bg-deep transition-colors">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-bg-deep rounded-xl text-accent"><Lock size={20} /></div>
                  <div>
                    <p className="font-bold text-sm">App Lock</p>
                    <p className="text-[8px] font-bold text-text-secondary uppercase">PIN Security</p>
                  </div>
               </div>
               <ChevronRight className="text-text-secondary group-hover:text-accent transition-colors" size={20} />
            </div>
            <div className="p-4 flex justify-between items-center group cursor-pointer hover:bg-bg-deep transition-colors">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-bg-deep rounded-xl text-accent"><Bell size={20} /></div>
                  <span className="font-bold text-sm">Notifications</span>
               </div>
               <ChevronRight className="text-text-secondary group-hover:text-accent transition-colors" size={20} />
            </div>
         </div>
      </section>

      <section className="space-y-4">
         <h3 className="text-[10px] font-bold text-text-secondary tracking-widest px-2 uppercase">DATA MANAGEMENT</h3>
         <div className="grid grid-cols-2 gap-4">
            <button className="bg-bg-surface p-6 rounded-2xl border border-divider shadow-lg flex flex-col items-center gap-3 active:scale-95 transition-transform hover:border-accent">
               <div className="p-2 bg-bg-deep rounded-xl text-accent"><FileText size={20} /></div>
               <span className="font-bold text-xs">Export CSV</span>
            </button>
            <button className="bg-bg-surface p-6 rounded-2xl border border-divider shadow-lg flex flex-col items-center gap-3 active:scale-95 transition-transform hover:border-accent">
               <div className="p-2 bg-bg-deep rounded-xl text-accent"><FileText size={20} /></div>
               <span className="font-bold text-xs">Export PDF</span>
            </button>
         </div>
      </section>

      <section className="space-y-4">
         <button 
           onClick={handleClearData}
           className="w-full p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform"
         >
            <Trash2 size={20} /> Clear Data
         </button>
         <p className="text-center text-[10px] font-bold text-text-secondary tracking-widest">APP VERSION 2.4.0 (BUILD 892)</p>
      </section>
    </div>
  );
}
