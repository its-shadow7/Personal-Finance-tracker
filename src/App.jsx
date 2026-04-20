import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AIProvider } from './context/AIContext';
import Layout from './components/Layout';
import Transactions from './pages/Transactions';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Budgets from './pages/Budgets';
import Settings from './pages/Settings';

function App() {
  return (
    <FinanceProvider>
      <CurrencyProvider>
        <AIProvider>
            <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/budgets" element={<Budgets />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
            </BrowserRouter>
        </AIProvider>
      </CurrencyProvider>
    </FinanceProvider>
  );
}

export default App;