import React, { useMemo, useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../context/CurrencyContext';
import { isThisMonth, format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, Activity, Sparkles } from 'lucide-react';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { useAI } from '../context/AIContext';

export default function Dashboard() {
  const { transactions } = useFinance();
  const { formatCurrency, convertCurrency, baseCurrency } = useCurrency();
  const { callGeminiText, apiKey } = useAI();
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);

  const { totalIncome, totalExpense, netFlow } = useMemo(() => {
    let income = 0; let expense = 0;
    transactions.forEach(t => {
      if (isThisMonth(t.date)) {
        const normalizedAmount = convertCurrency(t.amount, t.currency, baseCurrency);
        if (t.type === 'income') income += normalizedAmount;
        else expense += normalizedAmount;
      }
    });
    return { totalIncome: income, totalExpense: expense, netFlow: income - expense };
  }, [transactions, convertCurrency, baseCurrency]);

  const recentTx = useMemo(() => {
    return [...transactions].sort((a, b) => b.date - a.date).slice(0, 5);
  }, [transactions]);

  useEffect(() => {
    let active = true;
    const fetchAISummary = async () => {
        setIsGenerating(true);
        if (!apiKey) {
            if (active) setAiSummary("Live Gemini Insight requires an API Key. Please navigate to Settings to configure your secure local key.");
            setIsGenerating(false);
            return;
        }

        if (transactions.length === 0) {
            if (active) setAiSummary("Gemini Insight: No transactions logged this month yet. Start tracking your expenses to receive an AI-powered financial overview and anomaly detection.");
            setIsGenerating(false);
            return;
        }

        try {
            const relevantTx = transactions.slice(0, 30).map(t => ({ title: t.title, amount: t.amount, type: t.type, category: t.category, date: t.date }));
            const prompt = `Here is the user's recent financial data: ${JSON.stringify(relevantTx)}. Provide a crisp, 2-3 sentence financial overview highlighting anomalies, total flow, and a brief recommendation. Address the user directly.`;
            const system = "You are an expert financial advisor analyzing a user's expense tracker.";
            
            const responseText = await callGeminiText(system, prompt);
            if (active) setAiSummary(responseText);
        } catch (e) {
            console.error(e);
            if (!active) return;
            if (e.response && e.response.status === 429) {
                setAiSummary("Gemini API Rate Limit Exceeded (429). Free-tier applications process a limited number of requests. Please wait a moment for your quota to reset.");
            } else {
                setAiSummary("Gemini API Error. Please verify your API Key and Model String in Settings.");
            }
        } finally {
            if (active) setIsGenerating(false);
        }
    };

    fetchAISummary();
    return () => { active = false; };
  }, [transactions, apiKey]);

  return (
    <div className="w-full flex flex-col gap-6">
      <h1 className="text-2xl font-heading font-bold text-text-main mb-2">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-xl border border-border p-6 flex flex-col justify-between shadow-soft">
          <div className="text-text-muted text-sm font-medium mb-3 flex items-center gap-2">
            <ArrowUpRight size={16} className="text-success" /> Monthly Income
          </div>
          <div className="text-3xl font-heading font-bold text-text-main">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-6 flex flex-col justify-between shadow-soft">
          <div className="text-text-muted text-sm font-medium mb-3 flex items-center gap-2">
            <ArrowDownRight size={16} className="text-danger" /> Monthly Expenses
          </div>
          <div className="text-3xl font-heading font-bold text-text-main">{formatCurrency(totalExpense)}</div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-6 flex flex-col justify-between shadow-soft">
          <div className="text-text-muted text-sm font-medium mb-3 flex items-center gap-2">
            <Activity size={16} className={netFlow >= 0 ? "text-success" : "text-danger"} /> Net Cash Flow
          </div>
          <div className={`text-3xl font-heading font-bold ${netFlow >= 0 ? 'text-text-main' : 'text-danger'}`}>
            {netFlow > 0 ? '+' : ''}{formatCurrency(netFlow)}
          </div>
        </div>
      </div>

      <div className="bg-sidebar border border-border rounded-xl p-6 relative overflow-hidden shadow-soft">
         <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={64} className="text-primary" /></div>
         <h3 className="font-heading font-bold text-text-main flex items-center gap-2 mb-2"><Sparkles size={18} className="text-primary" /> AI Financial Overview</h3>
         {isGenerating ? (
              <div className="text-sm text-text-muted animate-pulse">Gemini is analyzing your data...</div>
         ) : (
              <p className="text-sm text-text-main font-medium leading-relaxed max-w-4xl">{aiSummary}</p>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-surface border border-border rounded-xl p-6 min-h-[300px] flex items-center justify-center flex-col shadow-soft">
             <div className="text-text-main text-sm mb-4 font-semibold w-full text-left font-heading">Monthly In/Out</div>
             <div className="w-full h-56 mt-2">
                 <MonthlyBarChart />
             </div>
         </div>
         <div className="bg-surface border border-border rounded-xl p-6 min-h-[300px] flex items-center justify-center flex-col shadow-soft">
             <div className="text-text-main text-sm mb-4 font-semibold w-full text-left font-heading">Expense Categories</div>
             <div className="w-full h-56 mt-2">
                 <CategoryPieChart />
             </div>
         </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-soft mt-2">
        <div className="px-6 py-5">
          <h3 className="font-heading font-bold text-text-main">Recent Transactions</h3>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-tableHeader text-text-main font-medium border-y border-border">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentTx.map(t => (
                <tr key={t.id} className="hover:bg-background/30 transition-colors">
                  <td className="px-6 py-4 text-text-main">
                    {format(t.date, 'MMM dd')}
                  </td>
                  <td className="px-6 py-4 text-text-main font-medium">
                    {t.title}
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {t.category}
                  </td>
                  <td className={`px-6 py-4 font-mono font-medium ${t.type === 'income' ? 'text-success' : 'text-text-main'}`}>
                    {t.type === 'expense' ? '-' : '+'}{formatCurrency(convertCurrency(t.amount, t.currency, baseCurrency))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-text-main">
                      <span className={`w-2 h-2 rounded-full ${isThisMonth(t.date) ? 'bg-success' : 'bg-warning'}`}></span>
                      {isThisMonth(t.date) ? 'Completed' : 'Pending'}
                    </div>
                  </td>
                </tr>
              ))}
              {recentTx.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">
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
