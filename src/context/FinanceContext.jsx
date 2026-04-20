import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext();

const defaultCategories = ['Food', 'Housing', 'Transportation', 'Utilities', 'Insurance', 'Medical', 'Saving', 'Debt', 'Personal'];

export function FinanceProvider({ children }) {
  // --- Lazy Initialization Helper ---
  const getStoredData = (key, defaultValue, reviver = null) => {
    try {
      const storedData = localStorage.getItem(key);
      if (!storedData) return defaultValue;
      return JSON.parse(storedData, reviver);
    } catch (error) {
      console.warn(`[FinanceContext] Failed to parse localStorage key "${key}". Falling back to default. Error:`, error);
      return defaultValue;
    }
  };

  // --- Transactions Reviver (Date Hydration) ---
  const transactionReviver = (key, value) => {
    if (key === 'date' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  // --- State Initialization (Lazy) ---
  const [transactions, setTransactions] = useState(() => 
    getStoredData('finance_transactions', [], transactionReviver)
  );
  
  const [categories, setCategories] = useState(() => 
    getStoredData('finance_categories', defaultCategories)
  );

  const [customBudgets, setCustomBudgets] = useState(() => 
    getStoredData('finance_budgets', [])
  );

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('finance_budgets', JSON.stringify(customBudgets));
  }, [customBudgets]);

  // --- State Actions ---
  const addTransaction = (txn) => {
    setTransactions(prev => [{ ...txn, id: uuidv4(), date: txn.date || new Date() }, ...prev]);
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
  };

  const deleteBudget = (id) => {
    setCustomBudgets(prev => prev.filter(b => b.id !== id));
  };

  return (
    <FinanceContext.Provider value={{
      transactions, 
      addTransaction, 
      updateTransaction, 
      deleteTransaction,
      categories, 
      addCategory,
      customBudgets, 
      addBudget, 
      deleteBudget
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
