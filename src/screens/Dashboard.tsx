import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { Bell, TrendingUp, TrendingDown, History, Target } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { format } from 'date-fns';

export default function Dashboard() {
  const { accounts, transactions, categories, settings } = useStore();
  const currency = settings.currency;
  
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'credit').reduce((acc, curr) => acc + curr.amount, 0);
  const totalSpent = transactions.filter(t => t.type === 'debit').reduce((acc, curr) => acc + curr.amount, 0);

  // Chart Data
  const donutData = categories.map(cat => ({
    name: cat.name,
    value: transactions.filter(t => t.categoryId === cat.id && t.type === 'debit').reduce((acc, curr) => acc + curr.amount, 0) || (cat.id === 'food' ? 200 : cat.id === 'rent' ? 1200 : 50),
    color: cat.color
  })).filter(d => d.value > 0);

  const barData = [
    { name: 'W1', in: 1200, out: 800 },
    { name: 'W2', in: 1500, out: 600 },
    { name: 'W3', in: 900, out: 1200 },
    { name: 'W4', in: 1600, out: 700 },
  ];

  return (
    <div className="flex flex-col gap-8 pb-24">
      {/* Header */}
      <header className="flex justify-between items-end bg-bg-primary/80 backdrop-blur-lg sticky top-0 p-4 -mx-4 z-40 border-b border-divider">
        <div>
          <h1 className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-1">Total Net Worth</h1>
          <div className="text-4xl font-bold tracking-tight text-white line-clamp-1">
            {formatCurrency(totalBalance, currency).split('.')[0]}
            <span className="text-accent opacity-80 text-2xl">.{formatCurrency(totalBalance, currency).split('.')[1] || '00'}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-bg-surface px-4 py-2 rounded-lg border border-divider flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">October 2023</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-bg-surface border border-divider flex items-center justify-center text-accent hover:bg-bg-deep transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Summary Row: Mini-Cards */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-bg-surface p-4 rounded-2xl border border-divider shadow-xl">
          <p className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">Income</p>
          <div className="flex items-center gap-2 text-accent">
             <TrendingUp size={16} />
             <span className="text-xl font-bold">+{formatCurrency(totalIncome, currency)}</span>
          </div>
        </div>
        <div className="bg-bg-surface p-4 rounded-2xl border border-divider shadow-xl">
          <p className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">Spent</p>
          <div className="flex items-center gap-2 text-danger">
             <TrendingDown size={16} />
             <span className="text-xl font-bold">-{formatCurrency(totalSpent, currency)}</span>
          </div>
        </div>
      </section>

      {/* Spending Breakdown Bento */}
      <section className="grid grid-cols-1 gap-6">
        <div className="bg-bg-surface p-6 rounded-3xl border border-divider shadow-xl">
          <h2 className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-6">Spending Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square w-full max-w-[220px] mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={5}
                    stroke="none"
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-3xl font-bold text-white">{formatCurrency(totalSpent, currency).split('.')[0]}</div>
                <div className="text-[10px] text-text-secondary uppercase tracking-tighter">Spent</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {donutData.map((item, idx) => (
                <div key={idx} className="bg-bg-deep p-3 rounded-xl border border-divider/50">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-text-secondary uppercase truncate">{item.name}</span>
                  </div>
                  <div className="text-sm font-bold">{formatCurrency(item.value, currency)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-bg-surface p-6 rounded-3xl border border-divider shadow-xl">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xs font-bold uppercase text-text-secondary tracking-widest">Flow Trends</h3>
             <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[8px] font-bold text-accent"><div className="w-2 h-2 rounded-full bg-accent" /> IN</div>
                <div className="flex items-center gap-1.5 text-[8px] font-bold text-danger"><div className="w-2 h-2 rounded-full bg-danger" /> OUT</div>
             </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <Bar dataKey="in" fill="#89E900" radius={[4, 4, 0, 0]} />
                <Bar dataKey="out" fill="#FF4D4D" radius={[4, 4, 0, 0]} />
                <XAxis dataKey="name" hide />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '12px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-text-secondary tracking-tighter opacity-40 mt-2">
             <span>WEEK 01</span><span>WEEK 02</span><span>WEEK 03</span><span>WEEK 04</span>
          </div>
        </div>

        {/* Categories & Budgets Combined */}
        <div className="bg-bg-surface p-6 rounded-3xl border border-divider shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-text-secondary text-xs font-bold uppercase tracking-widest">Budget Insights</h2>
            <button className="text-accent text-[10px] font-bold underline">MANAGE</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.slice(0, 4).map(cat => (
              <div key={cat.id} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">{cat.name}</p>
                    <p className="text-sm font-bold">$0 / ${cat.budgetLimit}</p>
                  </div>
                  <p className="text-[10px] font-bold text-accent">0% USED</p>
                </div>
                <div className="h-1.5 bg-bg-deep rounded-full overflow-hidden">
                   <div className="h-full bg-divider w-0 transition-all duration-1000" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Activity Feed */}
        <div className="bg-bg-deep p-6 rounded-3xl border border-divider shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-text-secondary text-xs font-bold uppercase tracking-widest">Recent Activity</h2>
            <History className="text-accent" size={16} />
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 3).length > 0 ? (
              transactions.slice(0, 3).map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-2xl bg-bg-surface border border-divider">
                  <div className="flex items-center gap-3 overflow-hidden">
                     <div className="w-10 h-10 shrink-0 rounded-xl bg-bg-deep flex items-center justify-center text-lg">{t.type === 'debit' ? '💸' : '💰'}</div>
                     <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{t.note || 'Adjustment'}</div>
                        <div className="text-[10px] text-text-secondary uppercase tracking-tighter">{format(new Date(t.date), 'MMM dd')} • {t.categoryId}</div>
                     </div>
                  </div>
                  <div className={cn("font-mono font-bold shrink-0", t.type === 'debit' ? 'text-danger' : 'text-accent')}>
                     {t.type === 'debit' ? '-' : '+'}{formatCurrency(t.amount, currency)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-bg-surface/50 rounded-2xl border border-dashed border-divider">
                <p className="text-xs text-text-secondary italic">No recent transactions yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Savings Goals */}
        <div className="bg-bg-surface p-6 rounded-3xl border border-divider shadow-xl">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-text-secondary text-xs font-bold uppercase tracking-widest">Financial Goals</h2>
              <Target className="text-accent" size={16} />
           </div>
           <div className="space-y-4">
              <div className="p-4 bg-bg-deep rounded-2xl border border-divider flex items-center justify-between">
                 <div>
                    <h4 className="text-sm font-bold text-white mb-1 tracking-tight">Tech Upgrade</h4>
                    <div className="flex items-center gap-2">
                       <div className="w-24 h-1 bg-bg-primary rounded-full overflow-hidden">
                          <div className="h-full bg-accent w-[65%]" />
                       </div>
                       <span className="text-[10px] font-bold text-text-secondary">65%</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-text-secondary font-bold uppercase mb-1">Target</p>
                    <p className="text-base font-bold text-white font-mono">$1,200</p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
