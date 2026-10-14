import React, { useState } from 'react';
import { Plus, Receipt, DollarSign, X, Eye, Check, Download, Calendar, User } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export interface Expense {
  id: string;
  rep: string;
  category: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function Expenses() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('salestrack_expenses', []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState({ rep: '', category: '', amount: '', date: new Date().toISOString().split('T')[0] });

  const handleStatusUpdate = (id: string, newStatus: 'Approved' | 'Rejected' | 'Pending') => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, status: newStatus } : e));
    if (selectedExpense && selectedExpense.id === id) {
      setSelectedExpense({ ...selectedExpense, status: newStatus });
    }
    toast.success(`Expense marked as ${newStatus}`);
  };

  const handleDownloadReceipt = (expense: Expense) => {
    const slip = `EXPENSE RECEIPT / CLAIM SLIP
-----------------------------------
Receipt ID: ${expense.id}
Date: ${expense.date}
Sales Rep: ${expense.rep}
Category: ${expense.category}
Amount: ₹${expense.amount.toFixed(2)}
Status: ${expense.status}
Verified By: Accounts Dept
-----------------------------------`;
    const blob = new Blob([slip], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${expense.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Receipt slip downloaded!');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.rep || !newExpense.category || !newExpense.amount) return;

    const expense: Expense = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      rep: newExpense.rep,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      status: 'Pending'
    };

    setExpenses([...expenses, expense]);
    setNewExpense({ rep: '', category: '', amount: '', date: new Date().toISOString().split('T')[0] });
    setIsAddModalOpen(false);
    toast.success('Expense submitted for approval');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expenses</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage field expense claims</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {expenses.length === 0 ? (
        <EmptyState 
          title="No Expenses Recorded" 
          description="There are no expense claims logged yet. Create a new expense to request reimbursement."
          icon={<DollarSign className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          action={
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="inline-block bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add Expense
            </button>
          }
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                  <th className="p-4 font-medium">ID</th>
                  <th className="p-4 font-medium">Representative</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 dark:text-slate-300">
                {expenses.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{e.id}</td>
                    <td className="p-4">{e.rep}</td>
                    <td className="p-4">{e.category}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">₹{e.amount.toFixed(2)}</td>
                    <td className="p-4">{e.date}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        e.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                        e.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>{e.status}</span>
                    </td>
                    <td className="p-4 flex gap-2 items-center">
                      <button 
                        onClick={() => setSelectedExpense(e)}
                        title="View Receipt & Details"
                        className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadReceipt(e)}
                        title="Download Receipt Slip"
                        className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {e.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(e.id, 'Approved')}
                            title="Quick Approve"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(e.id, 'Rejected')}
                            title="Quick Reject"
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Expense</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sales Rep Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={newExpense.rep}
                  onChange={e => setNewExpense({...newExpense, rep: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select 
                  required
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
                >
                  <option value="">Select category...</option>
                  <option value="Travel">Travel</option>
                  <option value="Food">Food</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  required
                  value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={newExpense.date}
                  onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Receipt & Details Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Expense Claim Receipt</h2>
              </div>
              <button onClick={() => setSelectedExpense(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Receipt card preview */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 space-y-3 font-mono text-sm">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Claim ID</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedExpense.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Sales Rep:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedExpense.rep}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Category:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedExpense.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Date:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedExpense.date}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-sans font-medium">Claim Amount:</span>
                  <span className="font-sans text-xl font-bold text-slate-900 dark:text-white">₹{selectedExpense.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 dark:text-slate-400">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    selectedExpense.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    selectedExpense.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {selectedExpense.status}
                  </span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Review & Status Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedExpense.id, 'Approved')}
                    disabled={selectedExpense.status === 'Approved'}
                    className={`py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      selectedExpense.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-400 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedExpense.id, 'Rejected')}
                    disabled={selectedExpense.status === 'Rejected'}
                    className={`py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      selectedExpense.status === 'Rejected'
                        ? 'bg-red-50 text-red-400 border border-red-200 dark:bg-red-950/20 dark:border-red-800/40 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                    }`}
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>

              {/* Download & Close actions */}
              <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleDownloadReceipt(selectedExpense)}
                  className="flex-1 py-2 px-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Slip
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedExpense(null)}
                  className="py-2 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
