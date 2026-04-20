import React, { useMemo, useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../context/CurrencyContext';
import { isThisMonth, format } from 'date-fns';
import { ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';

export default function Dashboard() {
  const { transactions } = useFinance();
  const { formatCurrency, convertCurrency, baseCurrency } = useCurrency();

  const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
    let balance = 0; let income = 0; let expense = 0;
    transactions.forEach(t => {
      const normalizedAmount = convertCurrency(t.amount, t.currency, baseCurrency);
      if (t.type === 'income') {
          balance += normalizedAmount;
          if (isThisMonth(t.date)) income += normalizedAmount;
      }
      else {
          balance -= normalizedAmount;
          if (isThisMonth(t.date)) expense += normalizedAmount;
      }
    });
    return { totalBalance: balance, totalIncome: income, totalExpense: expense };
  }, [transactions, convertCurrency, baseCurrency]);

  const recentTx = useMemo(() => {
    return [...transactions].sort((a, b) => b.date - a.date).slice(0, 5);
  }, [transactions]);

  return (
    <div className="w-full flex flex-col gap-6 -mt-10">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-heading font-semibold text-theme-text-dark pt-10">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-theme-bg-card rounded-2xl shadow-md p-6 flex flex-col justify-between border border-theme-border/10">
          <div className="text-theme-text-muted text-sm font-semibold mb-3 flex items-center justify-between">
            Total Balance
            <span className="flex items-center gap-1 bg-theme-secondary-accent/10 text-theme-secondary-accent px-2 py-0.5 rounded text-xs font-bold">
               <TrendingUp size={12} strokeWidth={3} /> Trend
            </span>
          </div>
          <div className="text-4xl font-heading font-bold text-theme-text-main tracking-tight">{formatCurrency(totalBalance)}</div>
        </div>
        <div className="bg-theme-bg-card rounded-2xl shadow-md p-6 flex flex-col justify-between border border-theme-border/10">
          <div className="text-theme-text-muted text-sm font-semibold mb-3">
            Monthly Income
          </div>
          <div className="text-4xl font-heading font-bold text-theme-text-main tracking-tight">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="bg-theme-bg-card rounded-2xl shadow-md p-6 flex flex-col justify-between border border-theme-border/10">
          <div className="text-theme-text-muted text-sm font-semibold mb-3">
            Monthly Expenses
          </div>
          <div className="text-4xl font-heading font-bold text-theme-text-main tracking-tight">{formatCurrency(totalExpense)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-theme-bg-card border border-theme-border/10 shadow-md rounded-2xl p-6 min-h-[300px] flex items-center justify-center flex-col">
             <div className="text-theme-text-main text-base font-bold w-full text-left font-heading mb-2">Spending Trends</div>
             <div className="w-full h-56 mt-2">
                 <MonthlyBarChart />
             </div>
         </div>
         <div className="bg-theme-bg-card border border-theme-border/10 shadow-md rounded-2xl p-6 min-h-[300px] flex items-center justify-center flex-col">
             <div className="text-theme-text-main text-base font-bold w-full text-left font-heading mb-2">Expense Categories</div>
             <div className="w-full h-56 mt-2">
                 <CategoryPieChart />
             </div>
         </div>
      </div>

      <div className="bg-theme-bg-card border border-theme-border/10 rounded-2xl overflow-hidden shadow-md mt-2">
        <div className="px-6 py-5 border-b border-theme-border/10">
          <h3 className="font-heading font-bold text-lg text-theme-text-main">Recent Transactions</h3>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-black/20 text-theme-text-muted font-semibold border-b border-theme-border/10">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/10">
              {recentTx.map(t => (
                <tr key={t.id} className="hover:bg-black/10 transition-colors">
                  <td className="px-6 py-4 text-theme-text-muted">
                    {format(t.date, 'MMM dd')}
                  </td>
                  <td className="px-6 py-4 text-theme-text-main font-medium">
                    {t.title}
                  </td>
                  <td className="px-6 py-4 text-theme-text-muted">
                    {t.category}
                  </td>
                  <td className={`px-6 py-4 font-mono font-medium ${t.type === 'income' ? 'text-theme-primary-accent' : 'text-theme-text-main'}`}>
                    {t.type === 'expense' ? '-' : '+'}{formatCurrency(convertCurrency(t.amount, t.currency, baseCurrency))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-theme-text-main font-medium">
                      <span className={`w-2.5 h-2.5 rounded-full ${isThisMonth(t.date) ? 'bg-theme-primary-accent' : 'bg-theme-secondary-accent'}`}></span>
                      {isThisMonth(t.date) ? 'Completed' : 'Pending'}
                    </div>
                  </td>
                </tr>
              ))}
              {recentTx.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-theme-text-muted">
                    No recent transactions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
