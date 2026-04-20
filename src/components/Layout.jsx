import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AddExpenseModal from './AddExpenseModal';
import { Plus, Globe } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';

export default function Layout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { baseCurrency, setBaseCurrency, rates } = useCurrency();

  return (
    <div className="min-h-screen bg-theme-bg pl-64 flex flex-col font-body text-theme-text-main">
      <Sidebar />
      
      <header className="h-16 bg-theme-bg/80 backdrop-blur border-b border-theme-border flex items-center justify-end px-8 sticky top-0 z-20 gap-4">
        
        {/* Base Currency Global Selector */}
        <div className="flex items-center gap-2 border border-theme-border bg-surface rounded-lg px-3 py-1.5 shadow-sm">
           <Globe size={16} className="text-theme-text-muted" />
           <select 
              value={baseCurrency} 
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="bg-transparent text-sm font-medium outline-none text-theme-text-main cursor-pointer appearance-none pr-4"
           >
              {rates ? Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>) : <option>{baseCurrency}</option>}
           </select>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-theme-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md transform active:scale-95"
        >
          <Plus size={18} /> Add Transaction
        </button>
      </header>

      <main className="flex-1 px-10 py-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && <AddExpenseModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
