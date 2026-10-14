import fs from 'fs';
import path from 'path';

const files = {
  'src/pages/shared/ComingSoon.tsx': `import { Construction } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function ComingSoon() {
  const location = useLocation();
  const title = location.pathname.split('/').pop()?.replace('-', ' ').toUpperCase() || 'MODULE';

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center">
        <Construction className="w-10 h-10 text-primary-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="text-slate-500 max-w-md">
        This production module is fully architected in the backend layout and will be deployed in the next sprint.
      </p>
    </div>
  );
}
`,
  'src/pages/admin/AIInsights.tsx': `import { BrainCircuit, TrendingUp, AlertTriangle, PackageSearch } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const forecastData = [
  { month: 'Jul', actual: 4000, forecast: null },
  { month: 'Aug', actual: 3000, forecast: null },
  { month: 'Sep', actual: 5000, forecast: null },
  { month: 'Oct', actual: 4500, forecast: 4500 },
  { month: 'Nov', actual: null, forecast: 5800 },
  { month: 'Dec', actual: null, forecast: 7200 },
];

const demandData = [
  { product: 'Lubricant 5L', demand: 85 },
  { product: 'Safety Gloves', demand: 45 },
  { product: 'Heavy Cleaner', demand: 92 },
  { product: 'Motor Oil', demand: 60 },
];

export default function AIInsights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <BrainCircuit className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Intelligence Hub</h1>
          <p className="text-slate-500">Machine learning powered predictions and anomaly detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Forecasting */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" /> Sales Forecasting
            </h3>
            <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">AI Model: Active</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={3} />
                <Line type="monotone" dataKey="forecast" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demand Prediction */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PackageSearch className="w-5 h-5 text-emerald-500" /> Demand Prediction
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="product" type="category" axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="demand" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unusual Transactions / Anomalies */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-red-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Unusual Transactions Detected
            </h3>
            <button className="text-sm font-medium text-red-600 hover:text-red-700">View Audit Log</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div>
                <p className="font-semibold text-red-900">Payment Flagged: PAY-108</p>
                <p className="text-sm text-red-700 mt-1">Transaction of $15,000 processed outside normal business hours (2:45 AM) from unverified IP.</p>
              </div>
              <button className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50">Review</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div>
                <p className="font-semibold text-amber-900">Inventory Anomaly: Heavy Cleaner</p>
                <p className="text-sm text-amber-700 mt-1">Stock depleted 400% faster than historical 30-day average.</p>
              </div>
              <button className="px-4 py-2 bg-white border border-amber-200 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-50">Investigate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  'src/pages/rep/RepDashboard.tsx': `import { CheckCircle, MapPin, Plus, Clock, DollarSign, Users, BrainCircuit, Sparkles, FileText } from 'lucide-react';
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

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-1 shadow-md">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900">AI Recommended Visits</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg border border-purple-100">
              <div>
                <p className="font-semibold text-purple-900">Globex Corp</p>
                <p className="text-xs text-purple-700">High probability of re-order (Low stock on Lubricant)</p>
              </div>
              <button className="bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-purple-700">Navigate</button>
            </div>
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <p className="font-semibold text-slate-700">Acme Industries</p>
                <p className="text-xs text-slate-500">Follow-up reminder due today</p>
              </div>
              <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-slate-50">Navigate</button>
            </div>
          </div>
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

      {/* AI Daily Report Draft */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <BrainCircuit className="w-16 h-16 text-slate-50 opacity-50 transform rotate-12" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-primary-500" />
          <h3 className="font-bold text-slate-900">Auto Daily Report</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          AI has drafted your daily report based on your GPS logs and 3 created orders.
        </p>
        <button className="w-full border border-primary-200 bg-primary-50 text-primary-700 font-medium py-2 rounded-lg text-sm hover:bg-primary-100 transition-colors">
          Review & Submit Report
        </button>
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
  'src/pages/shared/OrderTracking.tsx': `import { Package, Truck, CheckCircle, FileText, Upload } from 'lucide-react';

export default function OrderTracking() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order #ORD-002</h1>
          <p className="text-slate-500">Acme Corp • Placed on Oct 02, 2023</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Proof of Delivery
          </button>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Invoice (PDF)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-100"></div>
          
          <div className="space-y-8 relative">
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-white shadow-sm flex items-center justify-center z-10 shrink-0">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="pt-3">
                <h3 className="font-bold text-slate-900">Order Confirmed</h3>
                <p className="text-sm text-slate-500">Oct 02, 2023 at 10:30 AM</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center z-10 shrink-0">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="pt-3">
                <h3 className="font-bold text-slate-900">Processing & Packed</h3>
                <p className="text-sm text-slate-500">Oct 02, 2023 at 02:15 PM</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-primary-100 border-4 border-white shadow-sm flex items-center justify-center z-10 shrink-0 relative">
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"></span>
                <Truck className="w-6 h-6 text-primary-600" />
              </div>
              <div className="pt-3">
                <h3 className="font-bold text-primary-600">Dispatched & In Transit</h3>
                <p className="text-sm text-slate-500">Oct 03, 2023 at 09:00 AM</p>
                <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-sm font-medium text-slate-700">Consignment #CON-8839</p>
                  <p className="text-xs text-slate-500">Vehicle: NY-1234 • Driver: Mike</p>
                </div>
              </div>
            </div>

            <div className="flex gap-6 items-start opacity-50">
              <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-white shadow-sm flex items-center justify-center z-10 shrink-0">
                <CheckCircle className="w-6 h-6 text-slate-400" />
              </div>
              <div className="pt-3">
                <h3 className="font-bold text-slate-900">Delivered</h3>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  'src/pages/shared/Attendance.tsx': `export default function Attendance() {
  const records = [
    { date: '2023-10-01', in: '09:00 AM', out: '05:30 PM', hours: '8.5h', status: 'Present' },
    { date: '2023-10-02', in: '09:15 AM', out: '06:00 PM', hours: '8.75h', status: 'Present' },
    { date: '2023-10-03', in: '-', out: '-', hours: '0h', status: 'Leave' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance Log</h1>
        <p className="text-slate-500">Track working hours and availability</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Check In</th>
              <th className="p-4 font-medium">Check Out</th>
              <th className="p-4 font-medium">Working Hours</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {records.map((r, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="p-4 font-medium">{r.date}</td>
                <td className="p-4">{r.in}</td>
                <td className="p-4">{r.out}</td>
                <td className="p-4">{r.hours}</td>
                <td className="p-4">
                  <span className={\`px-2.5 py-1 rounded-full text-xs font-semibold \${
                    r.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }\`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`,
  'src/components/layout/DashboardLayout.tsx': `import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import { 
  LayoutDashboard, Map, Users, ShoppingCart, Package, LogOut, 
  CreditCard, Receipt, FileText, UserPlus, Calendar, PlusCircle,
  BrainCircuit, ShieldAlert, Undo2, Truck, BookOpen, Clock, Activity, MessageSquareWarning
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role !== 'Sales Representative';

  const menuGroups = isAdmin ? [
    {
      title: 'DASHBOARD & AI',
      items: [
        { label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'AI Insights Hub', icon: BrainCircuit, path: '/ai-insights' },
        { label: 'Analytics & Reports', icon: Activity, path: '/reports' },
      ]
    },
    {
      title: 'SALES & CRM',
      items: [
        { label: 'Customers', icon: Users, path: '/customers' },
        { label: 'Dealers', icon: Users, path: '/dealers' },
        { label: 'Orders', icon: ShoppingCart, path: '/orders' },
        { label: 'Consignments', icon: Truck, path: '/consignments' },
        { label: 'Complaints', icon: MessageSquareWarning, path: '/complaints' },
      ]
    },
    {
      title: 'FIELD OPERATIONS',
      items: [
        { label: 'Live Tracking', icon: Map, path: '/tracking' },
        { label: 'Employees', icon: UserPlus, path: '/employees' },
        { label: 'Attendance', icon: Clock, path: '/attendance' },
        { label: 'Digital Log Book', icon: BookOpen, path: '/log-book' },
      ]
    },
    {
      title: 'INVENTORY & FINANCE',
      items: [
        { label: 'Products & Stock', icon: Package, path: '/products' },
        { label: 'Returns & Damages', icon: Undo2, path: '/returns' },
        { label: 'Payments', icon: CreditCard, path: '/payments' },
        { label: 'Transactions', icon: Receipt, path: '/transactions' },
        { label: 'Expenses', icon: Receipt, path: '/expenses' },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Documents', icon: FileText, path: '/documents' },
        { label: 'Audit & Security', icon: ShieldAlert, path: '/audit' },
      ]
    }
  ] : [
    {
      title: 'DASHBOARD',
      items: [
        { label: 'Overview', icon: LayoutDashboard, path: '/rep/dashboard' },
        { label: 'Attendance', icon: Clock, path: '/attendance' },
      ]
    },
    {
      title: 'FIELD WORK',
      items: [
        { label: 'Customers', icon: Users, path: '/customers' },
        { label: 'Log Visit', icon: Calendar, path: '/visit' },
        { label: 'Create Order', icon: PlusCircle, path: '/create-order' },
        { label: 'My Orders', icon: ShoppingCart, path: '/orders' },
        { label: 'Order Tracking', icon: Truck, path: '/order-tracking' },
      ]
    },
    {
      title: 'RECORDS',
      items: [
        { label: 'Payments', icon: CreditCard, path: '/payments' },
        { label: 'Expenses', icon: Receipt, path: '/expenses' },
        { label: 'Returns', icon: Undo2, path: '/returns' },
      ]
    }
  ];

  const mobileNavItems = isAdmin ? menuGroups[0].items.concat(menuGroups[1].items).slice(0, 5) : menuGroups[0].items.concat(menuGroups[1].items).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className={\`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform \${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col h-screen\`}>
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800 shrink-0">
          <span className="text-xl font-bold text-white tracking-tight">SalesTrack <span className="text-primary-500">AI</span></span>
          <button className="md:hidden text-slate-400" onClick={() => setMobileMenuOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-6 px-3">
              <h4 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {group.title}
              </h4>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={\`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors \${isActive ? 'bg-primary-600/10 text-primary-400' : 'hover:bg-slate-800 hover:text-white'}\`}
                    >
                      <item.icon className={\`w-4 h-4 mr-3 \${isActive ? 'text-primary-400' : 'text-slate-400'}\`} />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <button onClick={logout} className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-slate-50">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {mobileNavItems.map((item) => (
          <Link key={item.path} to={item.path} className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-primary-600">
            <item.icon className={\`w-5 h-5 \${location.pathname === item.path ? 'text-primary-600' : ''}\`} />
            <span className="text-[10px] mt-1 font-medium truncate w-full text-center px-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
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
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(filepath, content);
  console.log('Created/Updated', filepath);
}
