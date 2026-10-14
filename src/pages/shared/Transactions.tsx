import React, { useState } from 'react';
import { Plus, CreditCard, DollarSign } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import PaymentModal from '../../components/ui/PaymentModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('salestrack_transactions', []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('amount') as string);
    const type = formData.get('type') as string;
    const desc = formData.get('description') as string;
    
    // If it's a Credit, open Stripe payment modal instead of just saving it
    if (type === 'Credit') {
      setCurrentAmount(amount);
      setModalOpen(false);
      setPaymentModalOpen(true);
      return;
    }

    const newTx: Transaction = { 
      id: `TXN-${Date.now().toString().slice(-6)}`,
      description: desc, 
      type, 
      amount, 
      date: new Date().toISOString().split('T')[0] 
    };
    
    setTransactions([newTx, ...transactions]);
    setModalOpen(false);
    toast.success('Transaction recorded');
  };

  const handlePaymentSuccess = async () => {
    setPaymentModalOpen(false);
    const newTx: Transaction = { 
      id: `TXN-${Date.now().toString().slice(-6)}`,
      description: 'Credit Card Payment', 
      type: 'Credit', 
      amount: currentAmount, 
      date: new Date().toISOString().split('T')[0] 
    };
    
    setTransactions([newTx, ...transactions]);
    toast.success('Payment processed successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage financial transactions</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> New Transaction
        </button>
      </div>

      {transactions.length === 0 ? (
        <EmptyState 
          title="No Transactions Found" 
          description="You haven't logged any payments or expenses yet. Add a new transaction to see it here."
          icon={<DollarSign className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          action={
            <button 
              onClick={() => setModalOpen(true)} 
              className="inline-block bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add Transaction
            </button>
          }
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{tx.date}</td>
                    <td className="p-4 text-sm text-slate-900 dark:text-slate-200">{tx.description}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.type === 'Credit' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`p-4 text-sm font-bold text-right ${tx.type === 'Credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      ₹{tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="New Transaction">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <input name="description" required className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Office Supplies" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
            <select name="type" className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500">
              <option value="Debit">Debit</option>
              <option value="Credit">Credit (Stripe Card Payment)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
            <input type="number" step="0.01" min="0.01" name="amount" required className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="0.00" />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-2 rounded-lg hover:bg-primary-700 shadow-sm shadow-primary-600/20 transition-colors">
              Continue
            </button>
          </div>
        </form>
      </Modal>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} amount={currentAmount} onSuccess={handlePaymentSuccess} />
    </div>
  );
}
