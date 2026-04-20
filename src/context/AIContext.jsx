import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AIContext = createContext();

export function AIProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('finance_gemini_key') || '');
  const [modelName, setModelName] = useState(() => {
      const cached = localStorage.getItem('finance_gemini_model');
      if (!cached || cached.includes('1.5') || cached.includes('3.1')) {
          return 'gemini-2.5-flash';
      }
      return cached;
  });

  useEffect(() => {
    localStorage.setItem('finance_gemini_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('finance_gemini_model', modelName);
  }, [modelName]);

  const callGemini = async (systemInstruction, userPrompt, inlineData = null) => {
    if (!apiKey) throw new Error("Gemini API Key missing.");

    const payload = {
        contents: [{ parts: [] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { responseMimeType: "application/json" }
    };

    if (inlineData) payload.contents[0].parts.push({ inlineData });
    if (userPrompt) payload.contents[0].parts.push({ text: userPrompt });

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, payload);
    const text = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(text);
  };

  const callGeminiText = async (systemInstruction, userPrompt) => {
    if (!apiKey) throw new Error("Gemini API Key missing.");

    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, payload);
    return response.data.candidates[0].content.parts[0].text;
  };

  return (
    <AIContext.Provider value={{ apiKey, setApiKey, modelName, setModelName, callGemini, callGeminiText }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) throw new Error("useAI must be used within AIProvider");
  return context;
}
