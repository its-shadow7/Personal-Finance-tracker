import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../context/CurrencyContext';
import { isThisMonth } from 'date-fns';
import { Trash2, Plus } from 'lucide-react';

export default function Budgets() {
  const { transactions, categories, customBudgets, addBudget, deleteBudget } = useFinance();
  const { formatCurrency, convertCurrency, baseCurrency } = useCurrency();
  
  const [bName, setBName] = useState('');
  const [bTarget, setBTarget] = useState('');
  const [bCats, setBCats] = useState([]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!bName || !bTarget || bCats.length === 0) return;
    addBudget({ name: bName, targetAmount: Number(bTarget), currency: baseCurrency, includedCategories: bCats });
    setBName(''); setBTarget(''); setBCats([]);
  };

  const toggleCat = (cat) => {
      setBCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const budgetProgress = useMemo(() => {
     return customBudgets.map(budget => {
         let spent = 0;
         transactions.forEach(t => {
             if (t.type === 'expense' && isThisMonth(t.date) && budget.includedCategories.includes(t.category)) {
                 spent += convertCurrency(t.amount, t.currency, baseCurrency);
             }
         });
         const convertedTarget = convertCurrency(budget.targetAmount, budget.currency || 'USD', baseCurrency);
         return {
             ...budget,
             spent,
             convertedTarget,
             percentage: Math.min((spent / convertedTarget) * 100, 100),
             isOver: spent > convertedTarget
         };
     });
  }, [customBudgets, transactions, convertCurrency, baseCurrency]);

  return (
    <div className="w-full flex flex-col gap-6 p-2">
      <h1 className="text-2xl font-heading font-bold text-theme-text-main pt-10 mb-2">Custom Grouped Budgets</h1>

      <div className="bg-theme-bg-card rounded-2xl border border-theme-border p-6 shadow-sm mb-4 text-theme-text-main">
          <h2 className="text-lg font-heading font-semibold text-theme-text-main mb-4">Create Budget Group</h2>
          <form className="flex flex-col md:flex-row gap-4 items-end" onSubmit={handleCreate}>
              <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-theme-text-muted mb-1">Budget Name</label>
                  <input type="text" value={bName} onChange={e => setBName(e.target.value)} placeholder="e.g. Discretionary, Weekend Survival" className="w-full text-sm border border-theme-border rounded-md p-2 outline-none focus:border-theme-primary-btn bg-white text-theme-text-main" />
              </div>
              <div className="w-full md:w-32">
                  <label className="block text-xs font-medium text-theme-text-muted mb-1">Target ({baseCurrency})</label>
                  <input type="number" value={bTarget} onChange={e => setBTarget(e.target.value)} placeholder="0.00" className="w-full text-sm border border-theme-border font-mono rounded-md p-2 outline-none focus:border-theme-primary-btn bg-white text-theme-text-main" />
              </div>
              
              <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-theme-text-muted mb-1">Merged Categories ({bCats.length} selected)</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                      {categories.map(c => (
                          <button key={c} type="button" onClick={() => toggleCat(c)} className={`text-xs px-2 py-1 rounded-md border transition-colors ${bCats.includes(c) ? 'bg-theme-primary-btn text-white border-theme-primary-btn' : 'bg-white text-theme-text-muted border-theme-border hover:border-theme-primary-btn'}`}>
                              {c}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="w-full md:w-auto mt-4 md:mt-0">
                  <button type="submit" disabled={!bName || !bTarget || bCats.length === 0} className="w-full md:w-auto bg-theme-primary-btn text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed h-[38px] flex items-center gap-2 justify-center shadow-sm">
                      <Plus size={16} /> Create
                  </button>
              </div>
          </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {budgetProgress.map(bp => (
              <div key={bp.id} className="bg-theme-bg-card rounded-2xl border border-theme-border p-6 shadow-sm relative group text-theme-text-main">
                  <button onClick={() => deleteBudget(bp.id)} className="absolute top-4 right-4 text-theme-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={18} />
                  </button>
                  <h3 className="font-heading font-medium text-lg text-theme-text-main mb-1">{bp.name}</h3>
                  <div className="flex gap-2 flex-wrap mb-6">
                      {bp.includedCategories.map(c => <span key={c} className="text-[10px] uppercase font-bold tracking-wider text-theme-text-muted bg-theme-bg-main px-2 py-0.5 rounded-full">{c}</span>)}
                  </div>
                  
                  <div className="flex justify-between items-end mb-2">
                       <div className="font-mono text-2xl font-medium text-theme-text-main">{formatCurrency(bp.spent)}</div>
                       <div className="text-sm font-medium text-theme-text-muted font-mono">{formatCurrency(bp.convertedTarget)} limit</div>
                  </div>

                  <div className="h-3 w-full bg-theme-bg-main rounded-full overflow-hidden border border-theme-border">
                      <div className={`h-full transition-all duration-1000 rounded-full ${bp.isOver ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-theme-primary-btn'}`} style={{ width: `${bp.percentage}%` }} />
                  </div>
                  
                  {bp.isOver && <div className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Over limit by {formatCurrency(bp.spent - bp.convertedTarget)}!</div>}
              </div>
          ))}

          {budgetProgress.length === 0 && (
             <div className="col-span-1 lg:col-span-2 text-center py-12 bg-theme-bg-card rounded-2xl border border-theme-border border-dashed shadow-sm">
                 <p className="text-theme-text-muted font-medium">No custom budgets configured.</p>
                 <p className="text-xs text-theme-text-muted opacity-70 mt-1">Group overlapping categories into discrete trackable pools.</p>
             </div>
          )}
      </div>
    </div>
  );
}
