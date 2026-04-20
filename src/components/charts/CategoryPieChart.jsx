import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { useCurrency } from '../../context/CurrencyContext';

const COLORS = ['#4F46E5', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#EF4444', '#14B8A6'];

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

  if (data.length === 0) {
      return <div className="w-full h-full flex items-center justify-center text-text-muted text-sm font-medium">Insufficient Data</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
