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

  console.log("Velocity Chart Data:", data);

  if (!data || data.length === 0) {
      return (
        <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="text-theme-text-muted text-sm font-medium italic">No spending velocity data available</p>
        </div>
      );
  }

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative', zIndex: 10 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val}`} />
          <Tooltip cursor={{ stroke: '#E5E7EB', strokeWidth: 2 }} formatter={(value) => formatCurrency(value)} labelFormatter={(label) => `Day ${label}`} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#111827' }} />
          <Line type="monotone" dataKey="spend" stroke="#C48668" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#C48668', stroke: '#fff', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
