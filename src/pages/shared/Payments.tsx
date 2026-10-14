import React, { useState } from 'react';
import { Download, Plus, CreditCard, Eye, X, CheckCircle, Receipt, User, Calendar, FileText } from 'lucide-react';
import PaymentModal from '../../components/ui/PaymentModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export interface Payment {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  date: string;
  method: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

export default function Payments() {
  const [payments, setPayments] = useLocalStorage<Payment[]>('salestrack_payments', []);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  
  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false);
    
    const newPayment: Payment = { 
      id: `PAY-${Date.now().toString().slice(-4)}`, 
      orderId: `ORD-${Math.floor(Math.random() * 10000)}`, 
      customer: 'Walk-in Customer', 
      amount: 100.00, 
      date: new Date().toISOString().split('T')[0], 
      method: 'Credit Card', 
      status: 'Paid' 
    };
    
    setPayments([newPayment, ...payments]);
    toast.success('Payment recorded successfully!');
  };

  const handleDownloadReceipt = (payment: Payment) => {
    const receiptContent = `====================================
        OFFICIAL PAYMENT RECEIPT
====================================
Receipt ID:      ${payment.id}
Order ID:        ${payment.orderId}
Customer:        ${payment.customer}
Date:            ${payment.date}
Payment Method:  ${payment.method}
Amount Paid:     ₹${payment.amount.toFixed(2)}
Payment Status:  ${payment.status}
====================================
Thank you for your business!
====================================`;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${payment.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Receipt for ${payment.id} downloaded!`);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payments</h1>
          <p className="text-slate-500 dark:text-slate-400">Track collections and process payments</p>
        </div>
        <button 
          onClick={() => setPaymentModalOpen(true)} 
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2 shadow-sm shadow-emerald-600/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Process Payment
        </button>
      </div>

      {payments.length === 0 ? (
        <EmptyState 
          title="No Payments Recorded" 
          description="You haven't processed or recorded any payments yet."
          icon={<CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          action={
            <button 
              onClick={() => setPaymentModalOpen(true)} 
              className="inline-block bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Record First Payment
            </button>
          }
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                  <th className="p-4 font-medium">Payment ID</th>
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                  <th className="p-4 font-medium">Method</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 dark:text-slate-300">
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{p.id}</td>
                    <td className="p-4 text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">{p.orderId}</td>
                    <td className="p-4 font-medium">{p.customer}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{p.date}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white text-right">₹{p.amount.toFixed(2)}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{p.method}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                        p.status === 'Failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>{p.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setSelectedPayment(p)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded" 
                          title="View Payment Receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadReceipt(p)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded" 
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Payment Processing Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)} 
        amount={100} 
        onSuccess={handlePaymentSuccess} 
      />

      {/* Payment Receipt / Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payment Receipt</h2>
              </div>
              <button 
                onClick={() => setSelectedPayment(null)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 space-y-3 font-mono text-sm">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Payment ID</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedPayment.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Order Ref:</span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">{selectedPayment.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Customer:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.customer}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Payment Date:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedPayment.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Payment Mode:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedPayment.method}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-sans font-medium">Total Paid:</span>
                  <span className="font-sans text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{selectedPayment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 dark:text-slate-400">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    selectedPayment.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    selectedPayment.status === 'Failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {selectedPayment.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
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
