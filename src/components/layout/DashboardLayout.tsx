import { Outlet, Link, useLocation } from 'react-router-dom';
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
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col h-screen`}>
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800 shrink-0">
          <span className="text-xl font-bold text-white tracking-tight">SalesTrack</span>
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
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-600/10 text-primary-400' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                      <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-primary-400' : 'text-slate-400'}`} />
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
          <div className="animate-fade-in-up h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Quick Action FAB */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <button 
          onClick={() => {
            // Placeholder for Quick Action menu toggle
            alert('Quick Actions Menu: New Order, Add Customer, Collect Payment, Start Visit, Add Expense');
          }}
          className="bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:scale-105 transition-transform"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] overflow-x-auto hide-scrollbar px-2 gap-2">
        {[
          { label: 'Home', icon: LayoutDashboard, path: '/rep/dashboard' },
          { label: 'Check-In', icon: Clock, path: '/attendance' },
          { label: 'Customers', icon: Users, path: '/customers' },
          { label: 'Visits', icon: Calendar, path: '/visit' },
          { label: 'Orders', icon: ShoppingCart, path: '/orders' },
          { label: 'More', icon: LayoutDashboard, path: '#' }
        ].map((item) => (
          <Link key={item.label} to={item.path} className="flex flex-col items-center justify-center min-w-[60px] h-full text-slate-500 hover:text-primary-600 transition-colors">
            <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-primary-600' : ''}`} />
            <span className={`text-[10px] mt-1 font-medium truncate w-full text-center px-1 ${location.pathname === item.path ? 'text-primary-600' : ''}`}>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
