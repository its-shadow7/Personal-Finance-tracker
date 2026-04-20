import React from 'react';
import { useAI } from '../context/AIContext';
import { Key, Sparkles, Cpu } from 'lucide-react';

export default function Settings() {
  const { apiKey, setApiKey, modelName, setModelName } = useAI();

  return (
    <div className="w-full flex flex-col gap-6 p-2 max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-theme-text-dark pt-10 mb-2">Settings & Integrations</h1>

      <div className="bg-theme-bg-card border border-theme-border/10 rounded-2xl p-6 shadow-md relative overflow-hidden text-theme-text-main">
         <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-theme-primary-accent"><Sparkles size={120} /></div>
         
         <h2 className="text-lg font-heading font-semibold text-theme-primary-accent mb-4 flex items-center gap-2">
             <Key size={18} /> Gemini API Integration
         </h2>
         <p className="text-sm text-theme-text-muted mb-6 leading-relaxed">
             This secure local dashboard requires a Google Gemini API Key to enable automated receipt scanning and personalized financial insights. Your key is stored strictly within your browser's local memory.
         </p>
         
         <div className="flex flex-col gap-4 relative z-10">
             <div>
                 <label className="text-xs font-medium text-theme-text-muted">Secret API Key</label>
                 <input 
                     type="password" 
                     value={apiKey} 
                     onChange={e => setApiKey(e.target.value)} 
                     placeholder="AIzaSy..."
                     className="w-full border border-theme-border/20 rounded-xl p-3 text-sm outline-none focus:border-theme-primary-accent font-mono bg-theme-bg-main/10 shadow-inner mt-1 text-theme-text-main"
                 />
                 <div className="text-[10px] text-theme-text-muted text-right mt-1">Saved automatically to localStorage.</div>
             </div>
             
             <div>
                 <label className="text-xs font-medium text-theme-text-muted flex items-center gap-1"><Cpu size={14}/> Target Model Selection</label>
                 <input 
                     type="text" 
                     list="gemini-models"
                     value={modelName} 
                     onChange={e => setModelName(e.target.value)} 
                     placeholder="gemini-2.5-flash"
                     className="w-full border border-theme-border/20 rounded-xl p-3 text-sm outline-none focus:border-theme-primary-accent font-mono bg-theme-bg-main/10 mt-1 text-theme-text-main"
                 />
                 <datalist id="gemini-models">
                     <option value="gemini-2.5-flash" />
                     <option value="gemini-2.5-pro" />
                     <option value="gemini-2.0-flash" />
                     <option value="gemini-2.0-flash-001" />
                 </datalist>
                 <div className="text-[10px] text-theme-text-muted mt-1">Select from standard tiers or explicitly type your custom target.</div>
             </div>
         </div>
      </div>
    </div>
  );
}
