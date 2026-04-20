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
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E9F0" strokeOpacity={0.1} />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A6ABB9' }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A6ABB9' }} tickFormatter={(val) => `$${val}`} />
        <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} formatter={(value) => formatCurrency(value)} labelFormatter={(label) => `Day ${label}`} contentStyle={{ backgroundColor: '#0C1D2D', borderRadius: '12px', border: '1px solid rgba(230, 233, 240, 0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', color: '#FFFFFF' }} />
        <Line type="monotone" dataKey="spend" stroke="#1F8D69" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#1F8D69', stroke: '#fff', strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
