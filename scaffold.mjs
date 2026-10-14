import fs from 'fs';
import path from 'path';

const dirs = [
  'src/components',
  'src/components/layout',
  'src/components/ui',
  'src/pages',
  'src/pages/auth',
  'src/pages/admin',
  'src/pages/rep',
  'src/pages/shared',
  'src/context',
  'src/lib',
  'src/types',
];

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

const files = {
  'src/index.css': `@import "tailwindcss";

@theme {
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;
}

body {
  background-color: #f8fafc; /* slate-50 */
  color: #0f172a; /* slate-900 */
  -webkit-font-smoothing: antialiased;
}

/* Leaflet fix */
.leaflet-container {
  width: 100%;
  height: 100%;
  z-index: 10;
}
`,
  'src/types/index.ts': `export type Role = 'Super Admin' | 'Admin' | 'Sales Manager' | 'Area Manager' | 'Sales Representative' | 'Accounts' | 'Warehouse';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  territory?: string;
  avatar?: string;
}

export interface Customer {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  territory: string;
  type: string;
  outstanding: number;
  lastVisit: string;
  location: { lat: number, lng: number };
}

export interface Order {
  id: string;
  customerId: string;
  repId: string;
  date: string;
  status: 'Draft' | 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Cancelled';
  total: number;
  items: number;
}
`,
  'src/lib/mockData.ts': `import { User, Customer, Order } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@salestrack.com', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'John Doe', email: 'john@salestrack.com', role: 'Sales Representative', territory: 'North', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Jane Smith', email: 'jane@salestrack.com', role: 'Sales Representative', territory: 'South', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export const mockCustomers: Customer[] = [
  { id: 'C1', businessName: 'Acme Corp', ownerName: 'Alice', phone: '555-0101', email: 'alice@acme.com', address: '123 Main St', territory: 'North', type: 'Retail', outstanding: 1200, lastVisit: '2023-10-01', location: { lat: 40.7128, lng: -74.0060 } },
  { id: 'C2', businessName: 'Globex', ownerName: 'Bob', phone: '555-0202', email: 'bob@globex.com', address: '456 Market St', territory: 'South', type: 'Wholesale', outstanding: 0, lastVisit: '2023-09-28', location: { lat: 34.0522, lng: -118.2437 } },
];

export const mockOrders: Order[] = [
  { id: 'ORD-001', customerId: 'C1', repId: '2', date: '2023-10-01', status: 'Delivered', total: 500, items: 3 },
  { id: 'ORD-002', customerId: 'C2', repId: '3', date: '2023-10-02', status: 'Processing', total: 1250, items: 5 },
];
`,
  'src/context/AuthContext.tsx': `import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { mockUsers } from '../lib/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string) => {
    const found = mockUsers.find(u => u.email === email);
    if (found) setUser(found);
    else alert('User not found. Use admin@salestrack.com or john@salestrack.com');
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
`,
  'src/App.tsx': `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import RepDashboard from './pages/rep/RepDashboard';
import LiveTracking from './pages/shared/LiveTracking';
import Customers from './pages/shared/Customers';
import Orders from './pages/shared/Orders';
import Products from './pages/shared/Products';

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
        
        {/* Admin Routes */}
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="tracking" element={<LiveTracking />} />
        
        {/* Rep Routes */}
        <Route path="rep/dashboard" element={<RepDashboard />} />
        
        {/* Shared Routes */}
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
`,
  'src/main.tsx': `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`,
  'src/components/layout/DashboardLayout.tsx': `import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Map, Users, ShoppingCart, Package, LogOut, Menu, X, UserCircle } from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role !== 'Sales Representative';

  const navItems = isAdmin ? [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Live Tracking', icon: Map, path: '/tracking' },
    { label: 'Customers', icon: Users, path: '/customers' },
    { label: 'Orders', icon: ShoppingCart, path: '/orders' },
    { label: 'Products', icon: Package, path: '/products' },
  ] : [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/rep/dashboard' },
    { label: 'Customers', icon: Users, path: '/customers' },
    { label: 'Orders', icon: ShoppingCart, path: '/orders' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-primary-600 tracking-tight">SalesTrack</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={\`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors \${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}\`}
              >
                <item.icon className={\`w-5 h-5 mr-3 \${isActive ? 'text-primary-600' : 'text-slate-400'}\`} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <span className="text-lg font-bold text-primary-600">SalesTrack</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 mb-16 md:mb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav (Reps Only typically, but let's show for all mobile for now) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 pb-safe z-50">
        {navItems.slice(0,4).map((item) => (
          <Link key={item.path} to={item.path} className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-primary-600">
            <item.icon className={\`w-6 h-6 \${location.pathname.startsWith(item.path) ? 'text-primary-600' : ''}\`} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
`,
  'src/pages/auth/Login.tsx': `import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@salestrack.com');
  const [password, setPassword] = useState('password');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome to SalesTrack</h2>
          <p className="text-center text-slate-500 mb-8">Sign in to your account</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white text-slate-900"
                required
              />
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white font-semibold py-2.5 rounded-lg hover:bg-primary-700 transition-colors">
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">Demo Logins:</p>
            <p className="text-xs text-slate-400">Admin: admin@salestrack.com</p>
            <p className="text-xs text-slate-400">Rep: john@salestrack.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  'src/pages/admin/AdminDashboard.tsx': `import { Users, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 6890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export default function AdminDashboard() {
  const kpis = [
    { title: "Today's Sales", value: '$24,500', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Active Reps', value: '45/50', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Pending Orders', value: '12', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Target Achieved', value: '85%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Overview of your sales operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
            <div className={\`w-12 h-12 rounded-lg flex items-center justify-center \${kpi.bg} mr-4\`}>
              <kpi.icon className={\`w-6 h-6 \${kpi.color}\`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Weekly Sales Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900">John Doe checked in</p>
                  <p className="text-xs text-slate-500">at Acme Corp • 10 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  'src/pages/rep/RepDashboard.tsx': `import { CheckCircle, MapPin, Plus, Clock, DollarSign, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RepDashboard() {
  const [location, setLocation] = useState<string>('Detecting location...');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(\`\${pos.coords.latitude.toFixed(4)}, \${pos.coords.longitude.toFixed(4)}\`),
        () => setLocation('Location access denied')
      );
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, John!</h1>
          <p className="text-slate-500">Here's your summary for today.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-slate-500 uppercase">Target Achieved</p>
          <p className="text-xl font-bold text-primary-600">65%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <MapPin className="w-6 h-6 text-indigo-500 mb-2" />
          <h3 className="text-2xl font-bold text-slate-900">5/12</h3>
          <p className="text-xs text-slate-500 mt-1">Customers Visited</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
          <h3 className="text-2xl font-bold text-slate-900">3</h3>
          <p className="text-xs text-slate-500 mt-1">Orders Created</p>
        </div>
      </div>

      <div className="bg-primary-600 rounded-xl p-6 text-white flex flex-col items-center justify-center text-center shadow-lg">
        <Clock className="w-8 h-8 mb-3 opacity-80" />
        <p className="text-primary-100 text-sm font-medium mb-1">Current Status</p>
        <h2 className="text-2xl font-bold mb-4">On Duty</h2>
        <div className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
          {location}
        </div>
        <div className="flex gap-3 mt-6 w-full">
          <button className="flex-1 bg-white text-primary-600 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors">
            Check In
          </button>
          <button className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors">
            End Day
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'New Order', icon: Plus, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Payment', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Add Lead', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map((action, i) => (
            <button key={i} className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary-200 transition-all">
              <div className={\`w-10 h-10 rounded-full flex items-center justify-center mb-2 \${action.bg}\`}>
                <action.icon className={\`w-5 h-5 \${action.color}\`} />
              </div>
              <span className="text-xs font-medium text-slate-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
`,
  'src/pages/shared/LiveTracking.tsx': `import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mockUsers } from '../../lib/mockData';

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const activeReps = [
  { id: '2', lat: 40.7128, lng: -74.0060, name: 'John Doe', status: 'Visiting Customer', lastUpdate: '2 mins ago' },
  { id: '3', lat: 40.7200, lng: -73.9900, name: 'Jane Smith', status: 'In Transit', lastUpdate: '5 mins ago' }
];

export default function LiveTracking() {
  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Live Field Tracking</h1>
        <p className="text-slate-500">Monitor your sales representatives in real-time</p>
      </div>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative">
        <MapContainer center={[40.7150, -74.0000]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {activeReps.map(rep => (
            <Marker key={rep.id} position={[rep.lat, rep.lng]}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-slate-900">{rep.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{rep.status}</p>
                  <p className="text-xs text-slate-400">Updated: {rep.lastUpdate}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
`,
  'src/pages/shared/Customers.tsx': `import { mockCustomers } from '../../lib/mockData';
import { Search, Plus, MapPin, Phone, Mail } from 'lucide-react';

export default function Customers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500">Manage your customer database</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search customers..." 
          className="flex-1 border-none focus:ring-0 text-slate-900 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCustomers.map(customer => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{customer.businessName}</h3>
                <p className="text-sm text-slate-500">{customer.ownerName} • {customer.type}</p>
              </div>
              <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-full">
                {customer.territory}
              </span>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="w-4 h-4 mr-2 text-slate-400" /> {customer.phone}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="w-4 h-4 mr-2 text-slate-400" /> {customer.email}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" /> {customer.address}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Outstanding</p>
                <p className={\`font-bold \${customer.outstanding > 0 ? 'text-red-600' : 'text-emerald-600'}\`}>
                  \${customer.outstanding.toLocaleString()}
                </p>
              </div>
              <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`,
  'src/pages/shared/Orders.tsx': `import { mockOrders } from '../../lib/mockData';
import { Search, Filter } from 'lucide-react';

export default function Orders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500">Track and manage sales orders</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white p-2 px-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search orders..." className="flex-1 border-none focus:ring-0 py-2 outline-none" />
        </div>
        <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-slate-700 font-medium hover:bg-slate-50">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="p-4 font-medium text-slate-900">{order.id}</td>
                  <td className="p-4">{order.customerId}</td>
                  <td className="p-4">{order.date}</td>
                  <td className="p-4">{order.items}</td>
                  <td className="p-4 font-medium">\${order.total.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={\`px-2.5 py-1 rounded-full text-xs font-semibold \${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }\`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`,
  'src/pages/shared/Products.tsx': `export default function Products() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <p className="text-slate-500">Manage your product catalog and inventory</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
        <p className="text-slate-500">Product management view is under construction.</p>
      </div>
    </div>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(filepath, content);
  console.log('Created', filepath);
}
