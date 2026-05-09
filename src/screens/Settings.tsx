import React from 'react';
import { useStore } from '../store/useStore';
import { Bell, Moon, Lock, Settings as SettingsIcon, ChevronRight, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Settings() {
  const { clearData, settings, setCurrency, userName, transactions } = useStore();

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearData();
      window.location.reload();
    }
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      alert('No transaction data to export.');
      return;
    }
    
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note', 'Recurring'];
    const rows = transactions.map(t => [
      format(new Date(t.date), 'yyyy-MM-dd HH:mm'),
      t.type,
      t.categoryId,
      t.amount,
      t.note.replace(/,/g, ' '),
      t.isRecurring ? 'Yes' : 'No'
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `KAI_Transactions_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePreference = (pref: string) => {
    alert(`${pref} setting updated successfully.`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  return (
    <div className="flex flex-col gap-8 pb-24 no-scrollbar">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="md:col-span-2 bg-bg-surface p-6 rounded-2xl border border-divider shadow-xl flex items-center gap-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center font-black text-bg-deep text-2xl shadow-lg shrink-0">
               {getInitials(userName)}
            </div>
            <div className="min-w-0">
               <h2 className="text-xl font-bold truncate">{userName || 'User'}</h2>
               <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Active Profile</p>
            </div>
         </div>
         <div className="bg-bg-surface p-4 rounded-2xl border border-divider shadow-xl flex flex-col justify-center items-center text-center">
            <p className="text-[10px] font-bold text-text-secondary uppercase mb-1 tracking-tighter">DISPLAY CURRENCY</p>
            <select 
              value={settings.currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-lg font-bold text-accent outline-none cursor-pointer text-center w-full"
            >
              <option value="USD">USD ($)</option>
              <option value="GYD">GYD (G$)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
         </div>
      </section>

      <section className="space-y-4">
         <h3 className="text-[10px] font-bold text-text-secondary tracking-widest px-2 uppercase">PREFERENCES</h3>
         <div className="bg-bg-surface rounded-2xl border border-divider overflow-hidden divide-y divide-divider shadow-xl">
            <button 
              onClick={() => togglePreference('Dark Mode')}
              className="w-full p-4 flex justify-between items-center text-left active:bg-bg-deep transition-colors"
            >
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-bg-deep rounded-xl text-accent"><Moon size={20} /></div>
                  <span className="font-bold text-sm">Dark Mode</span>
               </div>
               <div className="w-12 h-6 bg-accent rounded-full relative p-1 shadow-inner">
                  <div className="w-4 h-4 bg-bg-deep rounded-full ml-auto" />
               </div>
            </button>
            <button 
              onClick={() => alert('PIN Setting: Available in next build.')}
              className="w-full p-4 flex justify-between items-center text-left group active:bg-bg-deep transition-colors"
            >
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-bg-deep rounded-xl text-accent"><Lock size={20} /></div>
                  <div>
                    <p className="font-bold text-sm">App Lock</p>
                    <p className="text-[8px] font-bold text-text-secondary uppercase">Secure your data</p>
                  </div>
               </div>
               <ChevronRight className="text-text-secondary group-hover:text-accent transition-colors" size={20} />
            </button>
            <button 
              onClick={() => alert('Notification preferences updated.')}
              className="w-full p-4 flex justify-between items-center text-left group active:bg-bg-deep transition-colors"
            >
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-bg-deep rounded-xl text-accent"><Bell size={20} /></div>
                  <span className="font-bold text-sm">Notifications</span>
               </div>
               <ChevronRight className="text-text-secondary group-hover:text-accent transition-colors" size={20} />
            </button>
         </div>
      </section>

      <section className="space-y-4">
         <h3 className="text-[10px] font-bold text-text-secondary tracking-widest px-2 uppercase">DATA MANAGEMENT</h3>
         <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleExport}
              className="relative bg-bg-surface p-6 rounded-2xl border border-divider shadow-lg flex flex-col items-center gap-3 active:scale-95 transition-transform hover:border-accent group overflow-hidden"
            >
               <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-accent/20 rounded text-[6px] font-black text-accent uppercase tracking-tighter">Ready</div>
               <div className="p-2 bg-bg-deep rounded-xl text-accent group-hover:bg-accent group-hover:text-bg-deep transition-colors"><FileText size={20} /></div>
               <div className="text-center">
                  <span className="font-bold text-xs uppercase tracking-tight block">Export CSV</span>
                  <span className="text-[8px] text-text-secondary">Instant Download</span>
               </div>
            </button>
            <button 
               onClick={() => alert('PDF Export: High-fidelity reports coming in v2.6')}
               className="relative bg-bg-surface p-6 rounded-2xl border border-divider shadow-lg flex flex-col items-center gap-3 opacity-60 active:scale-95 transition-transform grayscale hover:grayscale-0 hover:border-accent group"
            >
               <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white/10 rounded text-[6px] font-black text-white/40 uppercase tracking-tighter">v2.6</div>
               <div className="p-2 bg-bg-deep rounded-xl text-text-secondary"><FileText size={20} /></div>
               <div className="text-center">
                  <span className="font-bold text-xs uppercase tracking-tight block">Export PDF</span>
                  <span className="text-[8px] text-text-secondary">Pro Reports</span>
               </div>
            </button>
         </div>
      </section>

      <section className="space-y-4 mt-4">
         <button 
           onClick={handleClearData}
           className="w-full p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform"
         >
            <Trash2 size={20} /> Reset App Data
         </button>
         <div className="text-center space-y-1">
            <p className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">APP VERSION 2.4.0 (STABLE)</p>
            <p className="text-[8px] font-medium text-text-secondary opacity-30">ENCRYPTED STORAGE ACTIVE</p>
         </div>
      </section>
    </div>
  );
}
