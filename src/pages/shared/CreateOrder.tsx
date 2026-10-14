import { useState } from 'react';
import { Plus, Trash2, Save, Send } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Customer, Order } from '../../types';
import type { Product } from './Products';

export default function CreateOrder() {
  const navigate = useNavigate();
  const [customers] = useLocalStorage<Customer[]>('salestrack_customers', []);
  const [products] = useLocalStorage<Product[]>('salestrack_products', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('salestrack_orders', []);

  const [customerId, setCustomerId] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [items, setItems] = useState([{ productId: '', qty: 1 }]);
  
  const addItem = () => setItems([...items, { productId: '', qty: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      toast.error('Please select a customer');
      return;
    }
    if (items.some(i => !i.productId)) {
      toast.error('Please select products for all items');
      return;
    }

    const customer = customers.find(c => c.id === customerId);
    
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerId: customer ? customer.businessName : customerId,
      repId: '1', // Current user mock
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      total: total,
      items: items.length
    };

    setOrders([...orders, newOrder]);
    toast.success('Order submitted successfully!');
    navigate('/orders');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Order</h1>
          <p className="text-slate-500 dark:text-slate-400">Draft or submit a new sales order</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/orders')} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 font-medium shadow-sm shadow-primary-600/20">
            <Send className="w-4 h-4" /> Submit Order
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Customer</label>
            <select 
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg p-2.5 border focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
            >
              <option value="">Select Customer...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.businessName}</option>
              ))}
            </select>
            {customers.length === 0 && <p className="text-xs text-amber-500 mt-1">No customers exist yet. Add one in the Customers tab first.</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Delivery</label>
            <input 
              required
              type="date" 
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg p-2.5 border focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Order Items</h3>
            <button type="button" onClick={addItem} className="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:text-primary-700">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <div className="flex-1">
                  <select 
                    required
                    value={item.productId}
                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg p-2.5 border outline-none text-slate-900 dark:text-white"
                  >
                    <option value="">Select Product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - ${Number(p.price).toFixed(2)} (Stock: {p.stock})</option>
                    ))}
                  </select>
                  {products.length === 0 && <p className="text-xs text-amber-500 mt-1">No products exist yet. Add one in the Products tab first.</p>}
                </div>
                <div className="w-32">
                  <input 
                    required
                    type="number" 
                    min="1" 
                    value={item.qty}
                    onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg p-2.5 border outline-none text-slate-900 dark:text-white" 
                    placeholder="Qty"
                  />
                </div>
                <button type="button" onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 pt-6 flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Tax (18%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-3">
              <span>Grand Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
