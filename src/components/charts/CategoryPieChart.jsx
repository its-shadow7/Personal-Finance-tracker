import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { useCurrency } from '../../context/CurrencyContext';

const COLORS = [
  '#E58859', // Primary Orange
  '#DDA171', // Secondary Tan
  'rgba(229, 136, 89, 0.8)',
  'rgba(221, 161, 113, 0.8)',
  'rgba(229, 136, 89, 0.5)',
  'rgba(221, 161, 113, 0.5)',
];

export default function CategoryPieChart() {
  const { transactions } = useFinance();
  const { convertCurrency, baseCurrency, formatCurrency } = useCurrency();

  const data = useMemo(() => {
    const cats = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
          const normalizedAmount = convertCurrency(t.amount, t.currency, baseCurrency);
          cats[t.category] = (cats[t.category] || 0) + normalizedAmount;
      }
    });
    return Object.keys(cats).map(k => ({ name: k, value: cats[k] })).sort((a,b) => b.value - a.value).slice(0, 6);
  }, [transactions, convertCurrency, baseCurrency]);

  console.log("Pie Chart Data:", data);

  if (!data || data.length === 0) {
      return (
        <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="text-theme-text-muted text-sm font-medium italic">No expense data available for this period</p>
        </div>
      );
  }

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative', zIndex: 10 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
