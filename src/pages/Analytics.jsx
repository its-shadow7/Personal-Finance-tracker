import React, { useState, useEffect, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAI } from '../context/AIContext';
import { format, isThisMonth, subMonths, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import VelocityLineChart from '../components/charts/VelocityLineChart';
import { Sparkles, RefreshCw, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Analytics() {
  const { transactions, categories } = useFinance();
  const { formatCurrency, convertCurrency, baseCurrency } = useCurrency();
  const { callGeminiText } = useAI();

  const [insightData, setInsightData] = useState(() => localStorage.getItem('finance_ai_insight') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // 1. Data Aggregation for Gemini (Compact to save tokens)
  const aggregatedData = useMemo(() => {
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);
    
    const getTotals = (date) => {
        let inc = 0; let exp = 0;
        const cats = {};
        transactions.forEach(t => {
            if (isWithinInterval(t.date, { start: startOfMonth(date), end: endOfMonth(date) })) {
                const amount = convertCurrency(t.amount, t.currency, baseCurrency);
                if (t.type === 'income') inc += amount;
                else {
                    exp += amount;
                    cats[t.category] = (cats[t.category] || 0) + amount;
                }
            }
        });
        return { income: inc, expense: exp, categories: cats };
    };

    return {
        current: getTotals(currentMonth),
        previous: getTotals(lastMonth),
        baseCurrency
    };
  }, [transactions, convertCurrency, baseCurrency]);

  // 2. Trend Badge Calculation
  const trend = useMemo(() => {
    const curr = aggregatedData.current.expense;
    const prev = aggregatedData.previous.expense;
    if (prev === 0) return null;
    const diff = ((curr - prev) / prev) * 100;
    return {
        value: Math.abs(diff).toFixed(1),
        isUp: diff > 0,
        label: diff > 0 ? 'Up' : 'Down'
    };
  }, [aggregatedData]);

  const refreshInsights = async () => {
    setIsGenerating(true);
    setError(null);
    try {
        const prompt = `Analyze this financial data: Current Month: Income ${aggregatedData.current.income}, Expenses ${aggregatedData.current.expense}, Category Breakdown: ${JSON.stringify(aggregatedData.current.categories)}. Previous Month Expenses: ${aggregatedData.previous.expense}. 
        
        Return exactly 3 concise bullet points in Markdown:
        1. Positive trend
        2. Area of caution
        3. Actionable advice
        
        Do not include any conversational filler or introductory text. Return only the 3 bullet points.`;

        const result = await callGeminiText("You are a expert financial data analyst.", prompt);
        setInsightData(result);
        localStorage.setItem('finance_ai_insight', result);
    } catch (err) {
        console.error(err);
        setError("Failed to generate fresh insights. Please verify your API key in Settings.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-heading font-bold text-theme-text-dark pt-10 tracking-tight">Advanced Analytics</h1>
           <p className="text-theme-text-muted mt-1 text-sm font-medium">Deep insights into your financial velocity and habits.</p>
        </div>
        
        {trend && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm ${trend.isUp ? 'bg-theme-secondary-accent/10 border-theme-secondary-accent/20 text-theme-secondary-accent' : 'bg-theme-primary-accent/10 border-theme-primary-accent/20 text-theme-primary-accent'}`}>
                {trend.isUp ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                <span className="text-xs font-bold uppercase tracking-wider">
                    Spending {trend.label} {trend.value}%
                </span>
                <span className="text-[10px] opacity-60 font-medium whitespace-nowrap">vs last month</span>
            </div>
        )}
      </div>
      
      {/* AI Insight Card */}
      <div className="bg-theme-bg-card border border-theme-border/10 rounded-2xl shadow-md overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-black/20 border-b border-theme-border/10 flex justify-between items-center">
             <h3 className="font-heading font-bold text-theme-text-main flex items-center gap-2">
                <Sparkles size={18} className="text-theme-primary-accent" /> Gemini Intelligence
             </h3>
             <button 
                onClick={refreshInsights}
                disabled={isGenerating}
                className="flex items-center gap-2 text-xs font-semibold text-theme-primary-accent hover:bg-theme-primary-accent/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
             >
                <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
                {isGenerating ? 'Analyzing...' : 'Refresh Insights'}
             </button>
          </div>
          
          <div className="p-8">
            {isGenerating ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-theme-bg-main/10 rounded w-3/4"></div>
                    <div className="h-4 bg-theme-bg-main/10 rounded w-5/6"></div>
                    <div className="h-4 bg-theme-bg-main/10 rounded w-2/3"></div>
                </div>
            ) : error ? (
                <div className="flex items-center gap-3 text-theme-secondary-accent bg-theme-secondary-accent/5 p-4 rounded-xl border border-theme-secondary-accent/20">
                    <span className="text-sm font-medium">{error}</span>
                </div>
            ) : insightData ? (
                <div className="prose prose-sm max-w-none text-theme-text-main leading-relaxed marker:text-theme-primary-accent">
                    <ReactMarkdown>{insightData}</ReactMarkdown>
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-theme-text-muted text-sm italic">No insights generated for this period yet. Click refresh to begin analysis.</p>
                </div>
            )}
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-theme-bg-card rounded-2xl border border-theme-border/10 p-8 shadow-md flex flex-col">
              <h2 className="text-lg font-heading font-bold text-theme-text-main mb-6">Income vs Expense Trend</h2>
              <div className="flex-1 min-h-[300px]">
                  <MonthlyBarChart />
              </div>
          </div>
          
          <div className="bg-theme-bg-card rounded-2xl border border-theme-border/10 p-8 shadow-md flex flex-col">
              <h2 className="text-lg font-heading font-bold text-theme-text-main mb-6">Spending Velocity</h2>
              <div className="flex-1 min-h-[300px]">
                  <VelocityLineChart />
              </div>
          </div>

          <div className="bg-theme-bg-card rounded-2xl border border-theme-border/10 p-8 shadow-md xl:col-span-2 flex flex-col">
              <h2 className="text-lg font-heading font-bold text-theme-text-main mb-6 text-center">Expense Category Distribution</h2>
              <div className="min-h-[350px] w-full max-w-xl mx-auto">
                  <CategoryPieChart />
              </div>
          </div>
      </div>
    </div>
  );
}
