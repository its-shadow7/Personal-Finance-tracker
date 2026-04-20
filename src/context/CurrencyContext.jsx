import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [baseCurrency, setBaseCurrency] = useState(() => {
    return localStorage.getItem('finance_baseCurrency') || 'USD';
  });
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('finance_baseCurrency', baseCurrency);
    
    setLoading(true);
    axios.get(`https://v6.exchangerate-api.com/v6/106f4157ca056187d5799651/latest/${baseCurrency}`)
      .then(response => {
        setRates(response.data.conversion_rates);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch exchange rates", error);
        setLoading(false);
      });
  }, [baseCurrency]);

  const convertCurrency = (amount, fromCurrency, toCurrency = baseCurrency) => {
    if (!rates) return amount; 
    if (fromCurrency === toCurrency) return amount;
    
    const baseAmount = fromCurrency === baseCurrency 
        ? amount 
        : amount / (rates[fromCurrency] || 1);
        
    const finalAmount = toCurrency === baseCurrency 
        ? baseAmount 
        : baseAmount * (rates[toCurrency] || 1);
        
    return finalAmount;
  };

  const formatCurrency = (amount, currency = baseCurrency) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
  }

  return (
    <CurrencyContext.Provider value={{ baseCurrency, setBaseCurrency, rates, convertCurrency, formatCurrency, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
