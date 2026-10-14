import React, { useState } from 'react';
import { Search, Plus, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';

export interface Dealer {
  id: string;
  name: string;
  contact: string;
  location: string;
  status: 'Active' | 'Inactive';
}

export default function Dealers() {
  const [dealers, setDealers] = useLocalStorage<Dealer[]>('salestrack_dealers', []);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDealer: Dealer = {
      id: `DLR-${Date.now().toString().slice(-4)}`,
      name: formData.get('name') as string, 
      contact: formData.get('contact') as string, 
      location: formData.get('location') as string, 
      status: 'Active'
    };
    
    setDealers([...dealers, newDealer]);
    setModalOpen(false);
    toast.success('Dealer successfully added!');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dealers</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your dealer and distributor network</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Dealer
        </button>
      </div>

      {dealers.length === 0 ? (
        <EmptyState 
          title="No Dealers Found" 
          description="You haven't added any dealers to your network yet. Add your first dealer to start managing them."
          icon={<Users className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          action={
            <button 
              onClick={() => setModalOpen(true)} 
              className="inline-block bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add First Dealer
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealers.map(dealer => (
            <div key={dealer.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-all hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{dealer.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{dealer.contact}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${dealer.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                  {dealer.status}
                </span>
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg mt-4">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" /> {dealer.location}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Dealer">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dealership Name</label>
            <input name="name" required className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Acme Corp" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Person</label>
            <input name="contact" required className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. John Doe (555-0123)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
            <input name="location" required className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. 123 Main St, City" />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-lg hover:bg-primary-700 shadow-sm shadow-primary-600/20 transition-colors">
              Add Dealer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
