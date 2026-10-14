import React, { useState } from 'react';
import { Search, Plus, Truck, Package, Calendar, Pencil, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';

export interface Consignment {
  id: string;
  trackingId: string;
  dealer: string;
  status: 'In Transit' | 'Delivered' | 'Pending';
  date: string; // Dispatch date
  expectedDeliveryDate: string;
}

export default function Consignments() {
  const [consignments, setConsignments] = useLocalStorage<Consignment[]>('salestrack_consignments', []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingConsignment, setEditingConsignment] = useState<Consignment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newConsignment: Consignment = {
      id: `CSN-${Date.now().toString().slice(-4)}`,
      trackingId: formData.get('trackingId') as string,
      dealer: formData.get('dealer') as string,
      status: (formData.get('status') as Consignment['status']) || 'In Transit',
      date: (formData.get('date') as string) || today,
      expectedDeliveryDate: (formData.get('expectedDeliveryDate') as string) || '',
    };

    setConsignments([...consignments, newConsignment]);
    setModalOpen(false);
    toast.success('Consignment created successfully!');
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingConsignment) return;

    const formData = new FormData(e.currentTarget);
    const updatedDate = formData.get('date') as string;
    const updatedExpectedDeliveryDate = formData.get('expectedDeliveryDate') as string;
    const updatedStatus = formData.get('status') as Consignment['status'];
    const updatedDealer = formData.get('dealer') as string;

    setConsignments(
      consignments.map((c) =>
        c.id === editingConsignment.id
          ? {
              ...c,
              dealer: updatedDealer || c.dealer,
              status: updatedStatus || c.status,
              date: updatedDate || c.date,
              expectedDeliveryDate: updatedExpectedDeliveryDate || c.expectedDeliveryDate,
            }
          : c
      )
    );

    setEditingConsignment(null);
    toast.success('Consignment updated successfully!');
  };

  const filteredConsignments = consignments.filter(
    (item) =>
      item.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dealer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Consignments</h1>
          <p className="text-slate-500 dark:text-slate-400">Track shipments and deliveries to dealers</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> New Consignment
        </button>
      </div>

      {consignments.length > 0 && (
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tracking ID or dealer..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
      )}

      {consignments.length === 0 ? (
        <EmptyState
          title="No Consignments Found"
          description="There are no active shipments or consignments. Create a new consignment to start tracking."
          icon={<Package className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          action={
            <button
              onClick={() => setModalOpen(true)}
              className="inline-block bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Create Consignment
            </button>
          }
        />
      ) : filteredConsignments.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          No consignments match your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsignments.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-all hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.trackingId}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.dealer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : item.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}
                    >
                      {item.status}
                    </span>
                    <button
                      onClick={() => setEditingConsignment(item)}
                      title="Edit consignment dates & status"
                      className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg">
                    <Truck className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="font-medium mr-1.5">Dispatch:</span>
                    <span>{item.date || 'Not set'}</span>
                  </div>

                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="font-medium mr-1.5">Expected Delivery:</span>
                    <span>{item.expectedDeliveryDate || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Consignment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="New Consignment">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tracking ID</label>
            <input
              name="trackingId"
              required
              className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. TRK-987654321"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dealer</label>
            <input
              name="dealer"
              required
              className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dispatch Date</label>
              <input
                type="date"
                name="date"
                defaultValue={today}
                required
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Delivery Date</label>
              <input
                type="date"
                name="expectedDeliveryDate"
                required
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              name="status"
              defaultValue="In Transit"
              className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-lg hover:bg-primary-700 shadow-sm shadow-primary-600/20 transition-colors"
            >
              Create Consignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Consignment Modal */}
      <Modal
        isOpen={!!editingConsignment}
        onClose={() => setEditingConsignment(null)}
        title={`Edit Consignment - ${editingConsignment?.trackingId || ''}`}
      >
        {editingConsignment && (
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dealer</label>
              <input
                name="dealer"
                defaultValue={editingConsignment.dealer}
                required
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dispatch Date</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={editingConsignment.date}
                  required
                  className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  name="expectedDeliveryDate"
                  defaultValue={editingConsignment.expectedDeliveryDate || ''}
                  required
                  className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                name="status"
                defaultValue={editingConsignment.status}
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setEditingConsignment(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white font-bold py-2.5 rounded-lg hover:bg-primary-700 shadow-sm shadow-primary-600/20 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
