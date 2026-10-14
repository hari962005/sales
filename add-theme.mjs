import fs from 'fs';
import path from 'path';

const files = {
  'src/index.css': `@import "tailwindcss";

@theme {
  --color-primary-50: var(--primary-50);
  --color-primary-100: var(--primary-100);
  --color-primary-200: var(--primary-200);
  --color-primary-300: var(--primary-300);
  --color-primary-400: var(--primary-400);
  --color-primary-500: var(--primary-500);
  --color-primary-600: var(--primary-600);
  --color-primary-700: var(--primary-700);
  --color-primary-800: var(--primary-800);
  --color-primary-900: var(--primary-900);
}

:root {
  /* Default Blue Theme */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-800: #075985;
  --primary-900: #0c4a6e;
}

/* Theme: Emerald */
.theme-emerald {
  --primary-50: #ecfdf5;
  --primary-100: #d1fae5;
  --primary-200: #a7f3d0;
  --primary-300: #6ee7b7;
  --primary-400: #34d399;
  --primary-500: #10b981;
  --primary-600: #059669;
  --primary-700: #047857;
  --primary-800: #065f46;
  --primary-900: #064e3b;
}

/* Theme: Violet */
.theme-violet {
  --primary-50: #f5f3ff;
  --primary-100: #ede9fe;
  --primary-200: #ddd6fe;
  --primary-300: #c4b5fd;
  --primary-400: #a78bfa;
  --primary-500: #8b5cf6;
  --primary-600: #7c3aed;
  --primary-700: #6d28d9;
  --primary-800: #5b21b6;
  --primary-900: #4c1d95;
}

/* Theme: Rose */
.theme-rose {
  --primary-50: #fff1f2;
  --primary-100: #ffe4e6;
  --primary-200: #fecdd3;
  --primary-300: #fda4af;
  --primary-400: #fb7185;
  --primary-500: #f43f5e;
  --primary-600: #e11d48;
  --primary-700: #be123c;
  --primary-800: #9f1239;
  --primary-900: #881337;
}

/* Dark Mode Overrides (inverts slate/white) */
.dark {
  --color-white: #0f172a;
  --color-slate-50: #020617;
  --color-slate-100: #1e293b;
  --color-slate-200: #334155;
  --color-slate-300: #475569;
  --color-slate-400: #94a3b8;
  --color-slate-500: #cbd5e1;
  --color-slate-600: #e2e8f0;
  --color-slate-700: #f1f5f9;
  --color-slate-800: #f8fafc;
  --color-slate-900: #ffffff;
}

body {
  background-color: var(--color-slate-50);
  color: var(--color-slate-900);
  -webkit-font-smoothing: antialiased;
}

/* Leaflet fix */
.leaflet-container {
  width: 100%;
  height: 100%;
  z-index: 10;
}
`,
  'src/context/ThemeContext.tsx': `import React, { createContext, useContext, useState, useEffect } from 'react';

type ColorTheme = 'blue' | 'emerald' | 'violet' | 'rose';
type Mode = 'light' | 'dark';

interface ThemeContextType {
  colorTheme: ColorTheme;
  mode: Mode;
  setColorTheme: (theme: ColorTheme) => void;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem('colorTheme') as ColorTheme) || 'blue';
  });
  
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem('mode') as Mode) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove old themes
    root.classList.remove('theme-blue', 'theme-emerald', 'theme-violet', 'theme-rose');
    // Add new theme
    root.classList.add(\`theme-\${colorTheme}\`);
    localStorage.setItem('colorTheme', colorTheme);

    // Toggle dark mode
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('mode', mode);
  }, [colorTheme, mode]);

  return (
    <ThemeContext.Provider value={{ colorTheme, mode, setColorTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
`,
  'src/components/layout/Header.tsx': `import { Search, Bell, Moon, Sun, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  const { mode, setMode, colorTheme, setColorTheme } = useTheme();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="md:hidden">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers, orders, products..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all text-sm text-slate-900"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4 relative">
        {/* Theme Settings Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors flex items-center gap-2"
          >
            <Palette className="w-5 h-5 text-slate-600" />
          </button>
          
          {themeMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50">
              <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Color Theme</h4>
              <div className="flex gap-2 mb-4">
                {(['blue', 'emerald', 'violet', 'rose'] as const).map(t => (
                  <button 
                    key={t}
                    onClick={() => { setColorTheme(t); setThemeMenuOpen(false); }}
                    className={\`w-6 h-6 rounded-full \${
                      t === 'blue' ? 'bg-[#0ea5e9]' : 
                      t === 'emerald' ? 'bg-[#10b981]' : 
                      t === 'violet' ? 'bg-[#8b5cf6]' : 'bg-[#f43f5e]'
                    } \${colorTheme === t ? 'ring-2 ring-offset-2 ring-slate-400' : ''}\`}
                  />
                ))}
              </div>
              <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Mode</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setMode('light'); setThemeMenuOpen(false); }}
                  className={\`flex-1 py-1.5 flex justify-center items-center rounded-lg text-sm font-medium \${mode === 'light' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}\`}
                >
                  <Sun className="w-4 h-4 mr-1"/> Light
                </button>
                <button 
                  onClick={() => { setMode('dark'); setThemeMenuOpen(false); }}
                  className={\`flex-1 py-1.5 flex justify-center items-center rounded-lg text-sm font-medium \${mode === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}\`}
                >
                  <Moon className="w-4 h-4 mr-1"/> Dark
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="relative p-2 hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 lg:pl-6">
          <div className="hidden lg:block text-right">
            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="User" className="w-9 h-9 rounded-full border border-slate-200" />
        </div>
      </div>
    </header>
  );
}
`,
  'src/App.tsx': `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import RepDashboard from './pages/rep/RepDashboard';
import LiveTracking from './pages/shared/LiveTracking';
import Customers from './pages/shared/Customers';
import Orders from './pages/shared/Orders';
import Products from './pages/shared/Products';
import CreateOrder from './pages/shared/CreateOrder';
import Payments from './pages/shared/Payments';
import Expenses from './pages/shared/Expenses';
import Employees from './pages/admin/Employees';
import Reports from './pages/admin/Reports';
import CustomerVisit from './pages/rep/CustomerVisit';
import AIInsights from './pages/admin/AIInsights';
import OrderTracking from './pages/shared/OrderTracking';
import Attendance from './pages/shared/Attendance';
import ComingSoon from './pages/shared/ComingSoon';

const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const RoleBasedHome = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'Sales Representative') return <Navigate to="/rep/dashboard" />;
  return <Navigate to="/admin/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<RoleBasedHome />} />
        
        {/* Core Dashboards */}
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="rep/dashboard" element={<RepDashboard />} />
        
        {/* New / Deep Pages */}
        <Route path="ai-insights" element={<AIInsights />} />
        <Route path="order-tracking" element={<OrderTracking />} />
        <Route path="attendance" element={<Attendance />} />
        
        {/* Shared / Existent */}
        <Route path="tracking" element={<LiveTracking />} />
        <Route path="employees" element={<Employees />} />
        <Route path="reports" element={<Reports />} />
        <Route path="visit" element={<CustomerVisit />} />
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="create-order" element={<CreateOrder />} />
        <Route path="products" element={<Products />} />
        <Route path="payments" element={<Payments />} />
        <Route path="expenses" element={<Expenses />} />
        
        {/* Coming Soon Placeholders for extensive features */}
        <Route path="transactions" element={<ComingSoon />} />
        <Route path="consignments" element={<ComingSoon />} />
        <Route path="documents" element={<ComingSoon />} />
        <Route path="audit" element={<ComingSoon />} />
        <Route path="dealers" element={<ComingSoon />} />
        <Route path="returns" element={<ComingSoon />} />
        <Route path="complaints" element={<ComingSoon />} />
        <Route path="log-book" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(filepath, content);
  console.log('Created/Updated', filepath);
}
