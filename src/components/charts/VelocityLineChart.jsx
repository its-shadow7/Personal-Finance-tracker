import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { useCurrency } from '../../context/CurrencyContext';
import { isThisMonth, getDate, getDaysInMonth } from 'date-fns';

export default function VelocityLineChart() {
  const { transactions } = useFinance();
  const { convertCurrency, baseCurrency, formatCurrency } = useCurrency();

  const data = useMemo(() => {
    const daysInMonth = getDaysInMonth(new Date());
    const dailySpend = Array(daysInMonth).fill(0);
    
    transactions.forEach(t => {
        if (t.type === 'expense' && isThisMonth(t.date)) {
            const day = getDate(t.date) - 1;
            dailySpend[day] += convertCurrency(t.amount, t.currency, baseCurrency);
        }
    });

    let cumulative = 0;
    return dailySpend.map((spend, i) => {
        cumulative += spend;
        return { day: i + 1, spend: cumulative };
    });
  }, [transactions, convertCurrency, baseCurrency]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => `$${val}`} />
        <Tooltip cursor={{ stroke: '#E2E8F0', strokeWidth: 2 }} formatter={(value) => formatCurrency(value)} labelFormatter={(label) => `Day ${label}`} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        <Line type="monotone" dataKey="spend" stroke="#4F46E5" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
