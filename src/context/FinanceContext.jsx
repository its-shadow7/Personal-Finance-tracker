import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext();

const defaultCategories = ['Food', 'Housing', 'Transportation', 'Utilities', 'Insurance', 'Medical', 'Saving', 'Debt', 'Personal'];

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [customBudgets, setCustomBudgets] = useState([]);
  const isHydrated = useRef(false);

  useEffect(() => {
    try {
      const storedTx = localStorage.getItem('finance_transactions');
      if (storedTx) {
          setTransactions(JSON.parse(storedTx, (key, value) => {
            if (key === 'date') return new Date(value);
            return value;
          }));
      }
      
      const storedCats = localStorage.getItem('finance_categories');
      if (storedCats) setCategories(JSON.parse(storedCats));

      const storedBudgets = localStorage.getItem('finance_budgets');
      if (storedBudgets) setCustomBudgets(JSON.parse(storedBudgets));
    } catch (e) {
      console.error("Failed parsing localStorage data", e);
    }
    isHydrated.current = true;
  }, []);

  useEffect(() => {
    if (isHydrated.current) {
        localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (isHydrated.current) {
        localStorage.setItem('finance_categories', JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (isHydrated.current) {
        localStorage.setItem('finance_budgets', JSON.stringify(customBudgets));
    }
  }, [customBudgets]);

  const addTransaction = (txn) => {
    setTransactions(prev => [{ ...txn, id: uuidv4() }, ...prev]);
  };
  const updateTransaction = (id, updated) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = (cat) => {
    if (!categories.includes(cat)) {
        setCategories(prev => [...prev, cat]);
    }
  };

  const addBudget = (budget) => {
      setCustomBudgets(prev => [...prev, { ...budget, id: uuidv4() }]);
  }
  const deleteBudget = (id) => {
      setCustomBudgets(prev => prev.filter(b => b.id !== id));
  }

  return (
    <FinanceContext.Provider value={{
      transactions, addTransaction, updateTransaction, deleteTransaction,
      categories, addCategory,
      customBudgets, addBudget, deleteBudget
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error("useFinance must be used within FinanceProvider");
  return context;
}
