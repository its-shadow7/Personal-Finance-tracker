import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { useCurrency } from '../../context/CurrencyContext';
import { format, startOfMonth } from 'date-fns';

export default function MonthlyBarChart() {
  const { transactions } = useFinance();
  const { convertCurrency, baseCurrency, formatCurrency } = useCurrency();

  const data = useMemo(() => {
    const monthlyData = {};
    transactions.forEach(t => {
      const monthKey = format(startOfMonth(t.date), 'yyyy-MM');
      if (!monthlyData[monthKey]) monthlyData[monthKey] = { name: format(t.date, 'MMM yyyy'), Income: 0, Expense: 0 };
      
      const normalizedAmount = convertCurrency(t.amount, t.currency, baseCurrency);
      if (t.type === 'income') monthlyData[monthKey].Income += normalizedAmount;
      else monthlyData[monthKey].Expense += normalizedAmount;
    });

    return Object.keys(monthlyData).sort().map(k => monthlyData[k]).slice(-6);
  }, [transactions, convertCurrency, baseCurrency]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => `$${val}`} />
        <Tooltip cursor={{ fill: '#F8FAFC' }} formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
        <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
        <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
