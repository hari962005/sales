import React, { useState } from 'react';
import { Search, Plus, MapPin, Phone, Mail, X, Building, Calendar, DollarSign, UserCheck, Edit2, Check } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import type { Customer } from '../../types';

export default function Customers() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('salestrack_customers', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditingOutstanding, setIsEditingOutstanding] = useState(false);
  const [editedOutstanding, setEditedOutstanding] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    territory: '',
    type: 'Retail',
    outstanding: 0,
    communicatedBy: '',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      ...newCustomer as Customer,
      id: `CUST-${Date.now()}`,
      lastVisit: new Date().toISOString().split('T')[0],
      location: { lat: 0, lng: 0 }
    };
    setCustomers([...customers, customer]);
    setIsModalOpen(false);
    toast.success('Customer added successfully!');
    setNewCustomer({
      businessName: '',
      ownerName: '',
      phone: '',
      email: '',
      address: '',
      territory: '',
      type: 'Retail',
      outstanding: 0,
      communicatedBy: '',
    });
  };

  const handleSaveOutstanding = () => {
    if (!selectedCustomer) return;
    const updated = { ...selectedCustomer, outstanding: Number(editedOutstanding) || 0 };
    setCustomers(customers.map(c => c.id === selectedCustomer.id ? updated : c));
    setSelectedCustomer(updated);
    setIsEditingOutstanding(false);
    toast.success('Outstanding bill updated successfully!');
  };

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.businessName?.toLowerCase().includes(query) ||
      customer.ownerName?.toLowerCase().includes(query) ||
      customer.territory?.toLowerCase().includes(query) ||
      customer.phone?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.communicatedBy?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your customer database</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {customers.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers by name, owner, territory, phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none focus:ring-0 bg-transparent text-slate-900 dark:text-white outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {customers.length === 0 ? (
        <EmptyState 
          title="No Customers Yet" 
          description="Start building your customer database by adding your first client."
          action={
            <button onClick={() => setIsModalOpen(true)} className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 px-6 py-2 rounded-lg font-medium transition-colors">
              Add First Customer
            </button>
          }
        />
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">No customers match your search query &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <div key={customer.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{customer.businessName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{customer.ownerName} • {customer.type}</p>
                </div>
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2 py-1 rounded-full">
                  {customer.territory}
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" /> 
                  <span className="truncate">{customer.phone}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" /> 
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" /> 
                  <span className="truncate">{customer.address}</span>
                </div>
                {customer.communicatedBy && (
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <UserCheck className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" /> 
                    <span className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                      Communicated by: <span className="text-slate-800 dark:text-slate-200 font-semibold">{customer.communicatedBy}</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Outstanding</p>
                  <p className={`font-bold ${customer.outstanding > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    ₹{customer.outstanding.toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsEditingOutstanding(false);
                    setEditedOutstanding(customer.outstanding || 0);
                  }}
                  className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Customer</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                <input 
                  required 
                  type="text" 
                  value={newCustomer.businessName} 
                  onChange={e => setNewCustomer({...newCustomer, businessName: e.target.value})} 
                  placeholder="e.g. Acme Stores"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Owner Name</label>
                  <input 
                    required 
                    type="text" 
                    value={newCustomer.ownerName} 
                    onChange={e => setNewCustomer({...newCustomer, ownerName: e.target.value})} 
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select 
                    required 
                    value={newCustomer.type} 
                    onChange={e => setNewCustomer({...newCustomer, type: e.target.value})} 
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="Retail">Retail</option>
                    <option value="Wholesale">Wholesale</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input 
                    required 
                    type="text" 
                    value={newCustomer.phone} 
                    onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} 
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email ID</label>
                  <input 
                    required 
                    type="email" 
                    value={newCustomer.email} 
                    onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} 
                    placeholder="e.g. owner@example.com"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Territory</label>
                <input 
                  required 
                  type="text" 
                  value={newCustomer.territory} 
                  onChange={e => setNewCustomer({...newCustomer, territory: e.target.value})} 
                  placeholder="e.g. North Zone / Downtown"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Communicated By (Sales Rep Name)</label>
                <input 
                  type="text" 
                  value={newCustomer.communicatedBy || ''} 
                  onChange={e => setNewCustomer({...newCustomer, communicatedBy: e.target.value})} 
                  placeholder="Sales Rep Name (e.g. John Doe)"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address/Location</label>
                <textarea 
                  required 
                  rows={2}
                  value={newCustomer.address} 
                  onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} 
                  placeholder="e.g. 123 Commercial Road, Market Square"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{selectedCustomer.id}</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedCustomer.businessName}</h2>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {selectedCustomer.type}
                </span>
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Territory: {selectedCustomer.territory}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Outstanding Bill / Balance</p>
                  {!isEditingOutstanding ? (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditedOutstanding(selectedCustomer.outstanding || 0);
                        setIsEditingOutstanding(true);
                      }}
                      className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Bill
                    </button>
                  ) : null}
                </div>
                {!isEditingOutstanding ? (
                  <p className={`text-2xl font-bold ${selectedCustomer.outstanding > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    ₹{selectedCustomer.outstanding.toLocaleString()}
                  </p>
                ) : (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 dark:text-slate-200">₹</span>
                      <input 
                        type="number" 
                        min="0"
                        step="1"
                        value={editedOutstanding} 
                        onChange={e => setEditedOutstanding(parseFloat(e.target.value) || 0)} 
                        className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-lg font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={handleSaveOutstanding}
                        className="px-3 py-1 bg-primary-600 text-white rounded-md text-xs font-semibold hover:bg-primary-700 flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Save
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsEditingOutstanding(false)}
                        className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Owner Name</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedCustomer.ownerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Phone Number</p>
                    <a 
                      href={`tel:${selectedCustomer.phone}`}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      {selectedCustomer.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Email Address</p>
                    <a 
                      href={`mailto:${selectedCustomer.email}`} 
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium break-all"
                    >
                      {selectedCustomer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Address / Location</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{selectedCustomer.address}</p>
                  </div>
                </div>

                {selectedCustomer.lastVisit && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Last Visit</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{selectedCustomer.lastVisit}</p>
                    </div>
                  </div>
                )}

                {selectedCustomer.communicatedBy && (
                  <div className="flex items-start gap-3">
                    <UserCheck className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Communicated By (Sales Rep)</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedCustomer.communicatedBy}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
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
