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

  console.log("Bar Chart Data:", data);

  if (!data || data.length === 0) {
      return (
        <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="text-theme-text-muted text-sm font-medium italic">No monthly comparison data available</p>
        </div>
      );
  }

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative', zIndex: 10 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val}`} />
          <Tooltip cursor={{ fill: 'rgba(232, 212, 192, 0.3)' }} formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#111827' }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: '#6B7280' }} />
          <Bar dataKey="Income" fill="#E8D4C0" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="Expense" fill="#C48668" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
