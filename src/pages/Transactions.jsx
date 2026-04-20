import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../context/CurrencyContext';
import { format } from 'date-fns';
import { Edit2, Trash2, Check, X } from 'lucide-react';

export default function Transactions() {
  const { transactions, updateTransaction, deleteTransaction, categories } = useFinance();
  const { formatCurrency, convertCurrency, baseCurrency } = useCurrency();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditInit = (t) => {
      setEditingId(t.id);
      setEditForm({...t});
  }

  const handleEditSave = (id) => {
      updateTransaction(id, {
          ...editForm,
          amount: Number(editForm.amount),
      });
      setEditingId(null);
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-theme-text-main pt-10">Full Ledger</h1>
      </div>

      <div className="bg-theme-bg-card rounded-2xl border border-theme-border overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-theme-border/50 border-b border-theme-border text-xs uppercase text-theme-text-muted font-medium tracking-widest">
                      <tr>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Title</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4 flex items-center">Type</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                 <tbody className="divide-y divide-border">
                     {transactions.map(t => {
                         const isEditing = editingId === t.id;
                         return (
                              <tr key={t.id} className="hover:bg-theme-bg-main/20 transition-colors group border-b border-theme-border">
                                  <td className="px-6 py-4 whitespace-nowrap text-theme-text-muted font-mono text-xs">
                                     {format(t.date, 'yyyy-MM-dd')}
                                 </td>
                                  <td className="px-6 py-4 font-medium text-theme-text-main">
                                      {isEditing ? (
                                          <input className="border border-theme-primary-btn p-2 text-sm rounded-lg w-full outline-none bg-theme-bg-main/5 text-theme-text-main" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                                      ) : t.title}
                                  </td>
                                  <td className="px-6 py-4">
                                      {isEditing ? (
                                          <select className="border border-theme-primary-btn p-2 text-sm rounded-lg w-full outline-none bg-theme-bg-main/5 text-theme-text-main" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                                              {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                          </select>
                                      ) : (
                                          <span className="px-2.5 py-1 bg-theme-bg-main text-theme-text-main rounded text-xs font-medium">{t.category}</span>
                                      )}
                                  </td>
                                  <td className="px-6 py-4 font-mono">
                                      {isEditing ? (
                                          <input className="border border-theme-primary-btn p-2 text-sm rounded-lg w-24 outline-none bg-theme-bg-main/5 text-theme-text-main" type="number" step="0.01" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} />
                                      ) : (
                                          <span className={t.type === 'income' ? 'text-theme-primary-btn font-medium' : 'text-theme-text-main'}>
                                             {formatCurrency(convertCurrency(t.amount, t.currency, baseCurrency))}
                                          </span>
                                      )}
                                  </td>
                                  <td className="px-6 py-4">
                                      {isEditing ? (
                                          <select className="border border-theme-primary-btn p-2 text-sm rounded-lg outline-none bg-theme-bg-main/5 text-theme-text-main" value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}>
                                              <option value="expense">Expense</option><option value="income">Income</option>
                                          </select>
                                      ) : (
                                          <span className={`capitalize text-xs font-medium px-2 py-1 rounded ${t.type === 'income' ? 'bg-theme-primary-btn/20 text-theme-primary-btn' : 'bg-theme-text-muted/20 text-theme-text-muted'}`}>{t.type}</span>
                                      )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      {isEditing ? (
                                          <div className="flex items-center justify-end gap-2">
                                             <button onClick={() => handleEditSave(t.id)} className="text-theme-primary-btn hover:bg-theme-primary-btn/20 p-1.5 rounded transition-colors"><Check size={16}/></button>
                                             <button onClick={() => setEditingId(null)} className="text-theme-text-muted hover:bg-theme-bg-main/20 p-1.5 rounded transition-colors"><X size={16}/></button>
                                          </div>
                                      ) : (
                                          <div className="flex items-center justify-end gap-2 text-theme-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button onClick={() => handleEditInit(t)} className="hover:text-theme-primary-btn p-1"><Edit2 size={16}/></button>
                                             <button onClick={() => deleteTransaction(t.id)} className="hover:text-theme-text-main p-1"><Trash2 size={16}/></button>
                                          </div>
                                      )}
                                  </td>
                             </tr>
                         );
                     })}
                     {transactions.length === 0 && (
                         <tr><td colSpan="6" className="px-6 py-12 text-center text-theme-text-muted">No transactions recorded yet. Click 'Add Transaction' to begin.</td></tr>
                     )}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
}
