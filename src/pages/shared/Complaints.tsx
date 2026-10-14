import React, { useState } from 'react';
import { Search, Plus, MessageSquareWarning } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export interface Complaint {
  id: string;
  customer: string;
  issue: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
}

export default function Complaints() {
  const [complaints, setComplaints] = useLocalStorage<Complaint[]>('salestrack_complaints', []);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newComplaint: Complaint = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      customer: formData.get('customer') as string, 
      issue: formData.get('issue') as string, 
      priority: formData.get('priority') as 'Low'|'Medium'|'High', 
      status: 'Open'
    };
    
    setComplaints([...complaints, newComplaint]);
    setModalOpen(false);
    toast.success('Complaint logged successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Complaints</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and resolve customer issues</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Log Complaint
        </button>
      </div>

      {complaints.length === 0 ? (
        <EmptyState 
          title="No Complaints" 
          description="There are no active complaints or issues recorded."
          icon={<MessageSquareWarning className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          action={
            <button 
              onClick={() => setModalOpen(true)} 
              className="inline-block bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Log an Issue
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.customer}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{item.issue}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                  item.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg inline-flex items-center gap-2">
                Priority: 
                <strong className={
                  item.priority === 'High' ? 'text-red-600 dark:text-red-400' : 
                  item.priority === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 
                  'text-slate-600 dark:text-slate-300'
                }>
                  {item.priority}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Log Complaint">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Customer</label>
            <input name="customer" required className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="Customer Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Issue Description</label>
            <textarea name="issue" required className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="Describe the issue..." rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
            <select name="priority" className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-lg hover:bg-primary-700 shadow-sm shadow-primary-600/20 transition-colors">
              Submit Complaint
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
