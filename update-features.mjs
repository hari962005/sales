import fs from 'fs';
import path from 'path';

const files = {
  'src/components/layout/Header.tsx': `import { Search, Bell, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="md:hidden">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers, orders, products..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-6">
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
  'src/components/layout/DashboardLayout.tsx': `import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import { LayoutDashboard, Map, Users, ShoppingCart, Package, LogOut, CreditCard, Receipt, FileText, UserPlus, Calendar, PlusCircle } from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role !== 'Sales Representative';

  const navItems = isAdmin ? [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Live Tracking', icon: Map, path: '/tracking' },
    { label: 'Employees', icon: UserPlus, path: '/employees' },
    { label: 'Customers', icon: Users, path: '/customers' },
    { label: 'Orders', icon: ShoppingCart, path: '/orders' },
    { label: 'Products', icon: Package, path: '/products' },
    { label: 'Payments', icon: CreditCard, path: '/payments' },
    { label: 'Expenses', icon: Receipt, path: '/expenses' },
    { label: 'Reports', icon: FileText, path: '/reports' },
  ] : [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/rep/dashboard' },
    { label: 'Customers', icon: Users, path: '/customers' },
    { label: 'Create Order', icon: PlusCircle, path: '/create-order' },
    { label: 'Orders', icon: ShoppingCart, path: '/orders' },
    { label: 'Payments', icon: CreditCard, path: '/payments' },
    { label: 'Expenses', icon: Receipt, path: '/expenses' },
    { label: 'Log Visit', icon: Calendar, path: '/visit' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className={\`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform \${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col\`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-primary-600 tracking-tight">SalesTrack</span>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={\`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors \${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}\`}
              >
                <item.icon className={\`w-5 h-5 mr-3 \${isActive ? 'text-primary-600' : 'text-slate-400'}\`} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button onClick={logout} className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav for Reps */}
      {!isAdmin && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {navItems.slice(0, 5).map((item) => (
            <Link key={item.path} to={item.path} className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-primary-600">
              <item.icon className={\`w-5 h-5 \${location.pathname === item.path ? 'text-primary-600' : ''}\`} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
`,
  'src/pages/shared/CreateOrder.tsx': `import { useState } from 'react';
import { Plus, Trash2, Save, Send } from 'lucide-react';

const mockProducts = [
  { id: 'P1', name: 'Industrial Lubricant 5L', price: 45.00, stock: 120 },
  { id: 'P2', name: 'Safety Gloves (Box)', price: 15.50, stock: 450 },
  { id: 'P3', name: 'Heavy Duty Cleaner', price: 28.00, stock: 80 },
];

export default function CreateOrder() {
  const [items, setItems] = useState([{ productId: '', qty: 1 }]);
  
  const addItem = () => setItems([...items, { productId: '', qty: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => {
    const product = mockProducts.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Order</h1>
          <p className="text-slate-500">Draft or submit a new sales order</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 font-medium">
            <Send className="w-4 h-4" /> Submit Order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
            <select className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-primary-500 outline-none">
              <option value="">Select Customer...</option>
              <option value="C1">Acme Corp</option>
              <option value="C2">Globex</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Expected Delivery</label>
            <input type="date" className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Order Items</h3>
            <button onClick={addItem} className="text-sm font-medium text-primary-600 flex items-center gap-1 hover:text-primary-700">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <div className="flex-1">
                  <select 
                    value={item.productId}
                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                    className="w-full border-slate-200 rounded-lg p-2.5 border outline-none"
                  >
                    <option value="">Select Product...</option>
                    {mockProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - $\${p.price.toFixed(2)} (Stock: {p.stock})</option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <input 
                    type="number" 
                    min="1" 
                    value={item.qty}
                    onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 1)}
                    className="w-full border-slate-200 rounded-lg p-2.5 border outline-none" 
                    placeholder="Qty"
                  />
                </div>
                <button onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>$\${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (18%)</span>
              <span>$\${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-200 pt-3">
              <span>Grand Total</span>
              <span>$\${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  'src/pages/shared/Products.tsx': `import { Plus, Search, Filter, Edit, Eye, ShoppingCart } from 'lucide-react';

const mockProducts = [
  { id: 'PRD-001', sku: 'LUB-5L', name: 'Industrial Lubricant 5L', category: 'Chemicals', price: 45.00, stock: 120, status: 'In Stock' },
  { id: 'PRD-002', sku: 'GLV-BX', name: 'Safety Gloves (Box)', category: 'PPE', price: 15.50, stock: 45, status: 'Low Stock' },
  { id: 'PRD-003', sku: 'CLN-HD', name: 'Heavy Duty Cleaner', category: 'Chemicals', price: 28.00, stock: 0, status: 'Out of Stock' },
];

export default function Products() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500">Manage catalog and inventory</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white p-2 px-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search by SKU or name..." className="flex-1 border-none focus:ring-0 py-2 outline-none" />
        </div>
        <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-slate-700 font-medium hover:bg-slate-50">
          <Filter className="w-4 h-4" /> Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
              <th className="p-4 font-medium">SKU</th>
              <th className="p-4 font-medium">Product Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {mockProducts.map((product) => (
              <tr key={product.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="p-4 font-mono text-xs text-slate-500">{product.sku}</td>
                <td className="p-4 font-medium text-slate-900">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4 font-medium">\$\${product.price.toFixed(2)}</td>
                <td className="p-4">{product.stock} units</td>
                <td className="p-4">
                  <span className={\`px-2.5 py-1 rounded-full text-xs font-semibold \${
                    product.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' :
                    product.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }\`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded"><ShoppingCart className="w-4 h-4" /></button>
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
  'src/pages/shared/Payments.tsx': `import { DollarSign, Search, Download, Plus } from 'lucide-react';

const mockPayments = [
  { id: 'PAY-101', orderId: 'ORD-001', customer: 'Acme Corp', amount: 500, date: '2023-10-01', method: 'Bank Transfer', status: 'Paid' },
  { id: 'PAY-102', orderId: 'ORD-002', customer: 'Globex', amount: 1250, date: '2023-10-02', method: 'Cheque', status: 'Pending' },
];

export default function Payments() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="text-slate-500">Track collections and transactions</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
              <th className="p-4 font-medium">Payment ID</th>
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Method</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {mockPayments.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="p-4 font-medium">{p.id}</td>
                <td className="p-4 text-primary-600 hover:underline cursor-pointer">{p.orderId}</td>
                <td className="p-4">{p.customer}</td>
                <td className="p-4">{p.date}</td>
                <td className="p-4 font-bold text-slate-900">\$\${p.amount.toFixed(2)}</td>
                <td className="p-4">{p.method}</td>
                <td className="p-4">
                  <span className={\`px-2.5 py-1 rounded-full text-xs font-semibold \${
                    p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }\`}>{p.status}</span>
                </td>
                <td className="p-4">
                  <button className="text-slate-400 hover:text-primary-600"><Download className="w-4 h-4" /></button>
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
  'src/pages/shared/Expenses.tsx': `import { Plus, Receipt } from 'lucide-react';

const mockExpenses = [
  { id: 'EXP-01', rep: 'John Doe', category: 'Fuel', amount: 45.50, date: '2023-10-01', status: 'Approved' },
  { id: 'EXP-02', rep: 'John Doe', category: 'Food', amount: 25.00, date: '2023-10-02', status: 'Pending' },
];

export default function Expenses() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-slate-500">Manage field expense claims</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Representative</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {mockExpenses.map((e) => (
              <tr key={e.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="p-4 font-medium">{e.id}</td>
                <td className="p-4">{e.rep}</td>
                <td className="p-4">{e.category}</td>
                <td className="p-4 font-bold text-slate-900">\$\${e.amount.toFixed(2)}</td>
                <td className="p-4">{e.date}</td>
                <td className="p-4">
                  <span className={\`px-2.5 py-1 rounded-full text-xs font-semibold \${
                    e.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }\`}>{e.status}</span>
                </td>
                <td className="p-4 flex gap-2">
                  <button className="text-slate-400 hover:text-primary-600"><Receipt className="w-4 h-4" /></button>
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
  'src/pages/admin/Employees.tsx': `import { UserPlus, MoreVertical, MapPin, Target } from 'lucide-react';

const mockEmployees = [
  { id: 'EMP-01', name: 'John Doe', role: 'Sales Representative', territory: 'North Region', target: 50000, status: 'Active', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 'EMP-02', name: 'Jane Smith', role: 'Sales Representative', territory: 'South Region', target: 50000, status: 'Active', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export default function Employees() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500">Manage your sales force</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEmployees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full border border-slate-200" />
                <div>
                  <h3 className="font-bold text-slate-900">{emp.name}</h3>
                  <p className="text-xs text-slate-500">{emp.role}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                Territory: <span className="font-medium ml-1 text-slate-900">{emp.territory}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Target className="w-4 h-4 mr-3 text-slate-400" />
                Target: <span className="font-medium ml-1 text-slate-900">\$\${emp.target.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 bg-slate-50 text-slate-700 border border-slate-200 py-2 rounded-lg text-sm font-medium hover:bg-slate-100">View Profile</button>
              <button className="flex-1 bg-primary-50 text-primary-700 border border-primary-100 py-2 rounded-lg text-sm font-medium hover:bg-primary-100">Performance</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`,
  'src/pages/admin/Reports.tsx': `import { Download, BarChart2, PieChart, LineChart } from 'lucide-react';

export default function Reports() {
  const reports = [
    { title: 'Sales Performance Report', desc: 'Monthly sales vs targets across all territories', icon: BarChart2, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Customer Visit Analysis', desc: 'Tracking of representative check-ins and conversion rates', icon: PieChart, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Expense Summary', desc: 'Breakdown of field expenses by category and employee', icon: LineChart, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-slate-500">Generate and export business insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className={\`w-12 h-12 rounded-lg flex items-center justify-center mb-4 \${report.bg}\`}>
              <report.icon className={\`w-6 h-6 \${report.color}\`} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{report.title}</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">{report.desc}</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary-50 text-primary-700 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 flex items-center justify-center gap-2">
                View
              </button>
              <button className="flex-1 bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`,
  'src/pages/rep/CustomerVisit.tsx': `import { useState } from 'react';
import { MapPin, Camera, FileText, CheckCircle, Clock } from 'lucide-react';

export default function CustomerVisit() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [notes, setNotes] = useState('');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Customer Visit</h1>
        <p className="text-slate-500">Record check-in, notes, and check-out</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Acme Corp</h2>
          <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" /> 123 Main St, North Territory
          </p>
        </div>

        <div className="p-6 space-y-6">
          {!isCheckedIn ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to start visit?</h3>
              <p className="text-slate-500 text-sm mb-6">Your GPS location will be recorded.</p>
              <button 
                onClick={() => setIsCheckedIn(true)}
                className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
              >
                Check In Now
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 p-4 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Checked In Successfully</span>
                </div>
                <span className="text-sm font-medium flex items-center gap-1"><Clock className="w-4 h-4"/> 10:45 AM</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Visit Notes & Outcome</label>
                <textarea 
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border-slate-200 rounded-lg p-3 border focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Discussed new product line, requested sample..."
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-slate-50 text-slate-700 py-3 rounded-lg font-medium border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100">
                  <Camera className="w-5 h-5" /> Add Photo
                </button>
                <button className="flex-1 bg-slate-50 text-slate-700 py-3 rounded-lg font-medium border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100">
                  <FileText className="w-5 h-5" /> Order
                </button>
              </div>

              <button 
                onClick={() => { alert('Visit completed!'); setIsCheckedIn(false); }}
                className="w-full bg-red-500 text-white py-3.5 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 mt-4"
              >
                End Visit & Check Out
              </button>
            </div>
          )}
        </div>
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
        <Route path="employees" element={<Employees />} />
        <Route path="reports" element={<Reports />} />
        
        {/* Rep Routes */}
        <Route path="rep/dashboard" element={<RepDashboard />} />
        <Route path="visit" element={<CustomerVisit />} />
        
        {/* Shared Routes */}
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="create-order" element={<CreateOrder />} />
        <Route path="products" element={<Products />} />
        <Route path="payments" element={<Payments />} />
        <Route path="expenses" element={<Expenses />} />
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
