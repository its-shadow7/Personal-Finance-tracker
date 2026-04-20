import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, BarChart3, PieChart, Settings } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/transactions', label: 'Transactions', icon: <List size={20} /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { to: '/budgets', label: 'Budgets', icon: <PieChart size={20} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-theme-bg-sidebar border-r border-theme-border flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="h-16 flex items-center px-6 border-b border-theme-border">
        <div className="font-heading font-bold text-lg text-theme-text-main tracking-tight italic">AdvancedFin</div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive 
                  ? 'bg-theme-primary-btn text-white shadow-sm' 
                  : 'text-theme-text-muted hover:bg-theme-border/50 hover:text-theme-text-main'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
