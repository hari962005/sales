import { Search, Filter, ShoppingCart } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import type { Order } from '../../types';

export default function Orders() {
  const [orders] = useLocalStorage<Order[]>('salestrack_orders', []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and manage sales orders</p>
        </div>
        <Link 
          to="/create-order"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
        >
          Create Order
        </Link>
      </div>

      {orders.length > 0 && (
        <div className="flex gap-4">
          <div className="flex-1 bg-white dark:bg-slate-800 p-2 px-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search orders..." className="flex-1 border-none focus:ring-0 py-2 outline-none bg-transparent text-slate-900 dark:text-white" />
          </div>
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState 
          title="No Orders Found" 
          description="You haven't created any sales orders yet. Create an order to track sales revenue."
          icon={<ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          action={
            <Link to="/create-order" className="inline-block bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 px-6 py-2 rounded-lg font-medium transition-colors">
              Create First Order
            </Link>
          }
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 dark:text-slate-300">
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{order.id}</td>
                    <td className="p-4">{order.customerId}</td>
                    <td className="p-4">{order.date}</td>
                    <td className="p-4">{order.items}</td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">₹{order.total.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link 
                        to={`/order-tracking?id=${order.id}`}
                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                      >
                        Track Order →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
