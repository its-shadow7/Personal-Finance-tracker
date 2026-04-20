import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, UploadCloud, RefreshCw } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAI } from '../context/AIContext';
import { useDropzone } from 'react-dropzone';

const schema = yup.object().shape({
  amount: yup.number().typeError('Must be a number').positive().required(),
  currency: yup.string().required(),
  category: yup.string().required(),
  type: yup.string().required(),
  date: yup.date().required(),
  title: yup.string().required(),
  notes: yup.string().optional()
});

export default function AddExpenseModal({ onClose }) {
  const { addTransaction, categories, addCategory } = useFinance();
  const { baseCurrency, rates } = useCurrency();
  const { callGemini, apiKey } = useAI();
  const [isParsing, setIsParsing] = useState(false);

  const { handleSubmit, register, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { type: 'expense', amount: '', currency: baseCurrency, category: categories[0] || 'Food', date: new window.Date().toISOString().slice(0, 10), title: '', notes: '' }
  });

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          const split = reader.result.split(',');
          // We need just the base64 string payload
          resolve({
              mimeType: file.type,
              data: split[1]
          });
      };
      reader.onerror = error => reject(error);
  });

  const onDrop = useCallback(async acceptedFiles => {
    if (!apiKey) {
        alert("Please set your Gemini API Key in the Settings tab first.");
        return;
    }
    const file = acceptedFiles[0];
    if (!file) return;

    setIsParsing(true);
    try {
        const inlineData = await fileToBase64(file);
        const categoriesList = categories.join(", ");
        
        const systemInstruction = `You are a financial receipt parser. Extract the total cost, vendor/merchant title, appropriate financial category (MUST be one of: ${categoriesList}), type (must be 'expense' or 'income'), notes (optional), and currency (e.g. USD, EUR, etc). If parsing a flight ticket or itinerary, the title should be the Airline and the category should be 'Transportation' or 'Travel' if available, or the closest match. Format response strictly as JSON with exactly these keys: amount (number), title (string), category (string), type (string), notes (string), currency (string). Do not return markdown blocks, return pure JSON string only.`;
        
        const result = await callGemini(systemInstruction, "Parse this document.", inlineData);
        
        if (result.amount) {
            const cleanAmount = parseFloat(String(result.amount).replace(/[^0-9.]/g, ''));
            if (!isNaN(cleanAmount)) setValue('amount', cleanAmount, { shouldValidate: true, shouldDirty: true });
        }
        if (result.title) setValue('title', result.title, { shouldValidate: true, shouldDirty: true });
        
        if (result.category) {
            if (!categories.includes(result.category)) addCategory(result.category);
            // Needs a tiny timeout for state execution to unroll before DOM updates
            setTimeout(() => setValue('category', result.category, { shouldValidate: true, shouldDirty: true }), 0);
        }
        
        if (result.currency) setValue('currency', result.currency.toUpperCase(), { shouldValidate: true, shouldDirty: true });
        if (result.type) setValue('type', result.type.toLowerCase(), { shouldValidate: true, shouldDirty: true });
        if (result.notes) setValue('notes', result.notes, { shouldValidate: true, shouldDirty: true });
    } catch(e) {
        console.error(e);
        if (e.response && e.response.status === 429) {
            alert("Gemini Rate Limit (429) reached! Please wait a minute before scanning another document.");
        } else {
            alert("Error parsing document. Please verify your API key and model selection.");
        }
    } finally {
        setIsParsing(false);
    }
  }, [setValue, categories, callGemini, apiKey]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': [], 'application/pdf': ['.pdf']} });

  const onSubmit = (data) => {
    addTransaction({
      title: data.title,
      amount: Number(data.amount),
      currency: data.currency,
      category: data.category,
      type: data.type,
      date: new window.Date(data.date),
      notes: data.notes || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-text-main/50 backdrop-blur-sm" />
      
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-surface rounded-lg w-full max-w-2xl z-10 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-background">
          <h2 className="text-lg font-heading font-semibold text-text-main">New Record</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col gap-4">
                <div className="text-sm font-medium text-text-muted uppercase tracking-wider">Smart Receipt</div>
                <div {...getRootProps()} className={`border-2 border-dashed rounded-md flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors flex-1 ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <input {...getInputProps()} />
                    {isParsing ? (
                        <div className="text-primary flex flex-col items-center"><RefreshCw className="animate-spin mb-2" size={24} /><span className="text-sm font-medium">Gemini Parsing...</span></div>
                    ) : (
                        <div className="text-text-muted flex flex-col items-center"><UploadCloud size={32} className="mb-2 opacity-50 text-primary" /><span className="text-sm font-medium">Drag PDF/IMG</span><span className="text-xs opacity-70 mt-1">Live Gemini Auto-Extract</span></div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="md:w-2/3 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="block text-xs font-medium text-text-muted mb-1">Type</label>
                       <select {...register("type")} className="w-full text-sm border border-border rounded-md p-2 bg-surface outline-none focus:border-primary">
                           <option value="expense">Expense</option>
                           <option value="income">Income</option>
                       </select>
                   </div>
                   <div>
                       <label className="block text-xs font-medium text-text-muted mb-1">Date</label>
                       <input type="date" {...register("date")} className="w-full text-sm border border-border rounded-md p-2 bg-surface outline-none focus:border-primary" />
                   </div>
               </div>

               <div>
                   <label className="block text-xs font-medium text-text-muted mb-1">Amount</label>
                   <div className="flex">
                        <select {...register("currency")} className="text-sm border border-border rounded-l-md px-3 bg-background outline-none border-r-0 font-mono">
                            <option value={baseCurrency}>{baseCurrency}</option>
                            {rates && Object.keys(rates).filter(c => c !== baseCurrency).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="number" step="0.01" {...register("amount")} placeholder="0.00" className="w-full text-sm border border-border rounded-r-md p-2 bg-surface outline-none focus:border-primary font-mono" />
                   </div>
                   {errors.amount && <span className="text-xs text-danger mt-1">{errors.amount.message}</span>}
               </div>

               <div>
                   <label className="block text-xs font-medium text-text-muted mb-1">Title / Merchant</label>
                   <input type="text" {...register("title")} className="w-full text-sm border border-border rounded-md p-2 bg-surface outline-none focus:border-primary" />
                   {errors.title && <span className="text-xs text-danger mt-1">{errors.title.message}</span>}
               </div>

               <div>
                   <label className="block text-xs font-medium text-text-muted mb-1">Category</label>
                   <select {...register("category")} className="w-full text-sm border border-border rounded-md p-2 bg-surface outline-none focus:border-primary">
                       {categories.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
               </div>
               
               <div>
                   <label className="block text-xs font-medium text-text-muted mb-1">Notes</label>
                   <textarea {...register("notes")} className="w-full text-sm border border-border rounded-md p-2 bg-surface outline-none focus:border-primary h-20 resize-none"></textarea>
               </div>

               <div className="pt-2">
                   <button type="submit" className="w-full bg-primary text-surface py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                       Save Record
                   </button>
               </div>
            </form>
        </div>
      </motion.div>
    </div>
  );
}
