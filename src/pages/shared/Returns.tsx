import React, { useState } from 'react';
import { Search, Plus, Undo2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export interface ReturnItem {
  id: string;
  orderId: string;
  reason: string;
  status: 'Processing' | 'Completed' | 'Rejected';
  amount: number;
}

export default function Returns() {
  const [returns, setReturns] = useLocalStorage<ReturnItem[]>('salestrack_returns', []);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newReturn: ReturnItem = {
      id: `RET-${Date.now().toString().slice(-6)}`,
      orderId: formData.get('orderId') as string, 
      reason: formData.get('reason') as string, 
      amount: parseFloat(formData.get('amount') as string), 
      status: 'Processing'
    };
    
    setReturns([...returns, newReturn]);
    setModalOpen(false);
    toast.success('Return processed successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Returns & Damages</h1>
          <p className="text-slate-500 dark:text-slate-400">Process returned goods and refunds</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Process Return
        </button>
      </div>

      {returns.length === 0 ? (
        <EmptyState 
          title="No Returns Found" 
          description="There are no returns or damaged goods recorded. That's a good thing!"
          icon={<Undo2 className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          action={
            <button 
              onClick={() => setModalOpen(true)} 
              className="inline-block bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Process Return
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {returns.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Undo2 className="w-4 h-4 text-slate-400" /> {item.orderId}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.reason}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                  item.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Refund Amount</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">${item.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Process Return">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Order ID</label>
            <input name="orderId" required className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. ORD-123456" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason for Return</label>
            <input name="reason" required className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Damaged in transit" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount to Refund ($)</label>
            <input type="number" step="0.01" min="0" name="amount" required className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="0.00" />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-lg hover:bg-primary-700 shadow-sm shadow-primary-600/20 transition-colors">
              Submit Return
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
