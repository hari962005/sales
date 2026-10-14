import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, FileText, Upload, Search, Clock, ArrowRight, ShieldCheck, MapPin, ChevronRight } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Order } from '../../types';

interface TrackedOrder extends Order {
  customerName: string;
  trackingNumber: string;
  vehicle: string;
  driver: string;
  timeline: {
    confirmedTime: string;
    packedTime: string;
    dispatchedTime: string;
    deliveredTime: string;
  };
}

const defaultTrackedOrders: TrackedOrder[] = [
  {
    id: 'ORD-002',
    customerId: 'C2',
    customerName: 'Globex Corp',
    repId: '2',
    date: '2023-10-02',
    status: 'In Transit',
    total: 1250,
    items: 5,
    trackingNumber: 'TRK-GLB-8839',
    vehicle: 'MH-04-AB-3421',
    driver: 'Rajesh Kumar',
    timeline: {
      confirmedTime: 'Oct 02, 10:30 AM',
      packedTime: 'Oct 02, 02:15 PM',
      dispatchedTime: 'Oct 03, 09:00 AM',
      deliveredTime: 'Pending'
    }
  },
  {
    id: 'ORD-001',
    customerId: 'C1',
    customerName: 'Acme Industries',
    repId: '2',
    date: '2023-10-01',
    status: 'Delivered',
    total: 500,
    items: 3,
    trackingNumber: 'TRK-ACM-7712',
    vehicle: 'DL-01-XY-9801',
    driver: 'Suresh Verma',
    timeline: {
      confirmedTime: 'Oct 01, 09:15 AM',
      packedTime: 'Oct 01, 11:30 AM',
      dispatchedTime: 'Oct 01, 01:45 PM',
      deliveredTime: 'Oct 01, 05:20 PM'
    }
  },
  {
    id: 'ORD-003',
    customerId: 'C3',
    customerName: 'Horizon Traders',
    repId: '3',
    date: '2023-10-03',
    status: 'Processing',
    total: 2850,
    items: 8,
    trackingNumber: 'TRK-HRZ-9014',
    vehicle: 'KA-05-MN-5520',
    driver: 'Anil Patil',
    timeline: {
      confirmedTime: 'Oct 03, 11:00 AM',
      packedTime: 'Oct 03, 03:45 PM',
      dispatchedTime: 'Pending',
      deliveredTime: 'Pending'
    }
  },
  {
    id: 'ORD-004',
    customerId: 'C4',
    customerName: 'Evergreen Chemicals',
    repId: '2',
    date: '2023-10-04',
    status: 'In Transit',
    total: 4200,
    items: 12,
    trackingNumber: 'TRK-EVG-4451',
    vehicle: 'MH-12-PQ-7789',
    driver: 'Vikram Singh',
    timeline: {
      confirmedTime: 'Oct 04, 08:30 AM',
      packedTime: 'Oct 04, 11:00 AM',
      dispatchedTime: 'Oct 04, 01:15 PM',
      deliveredTime: 'Pending'
    }
  }
];

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const [trackedOrders, setTrackedOrders] = useLocalStorage<TrackedOrder[]>('salestrack_tracked_orders', defaultTrackedOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(searchParams.get('id') || defaultTrackedOrders[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Transit' | 'Processing' | 'Delivered'>('All');
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);

  useEffect(() => {
    const paramId = searchParams.get('id');
    if (paramId && trackedOrders.some(o => o.id === paramId)) {
      setSelectedOrderId(paramId);
    }
  }, [searchParams, trackedOrders]);

  const selectedOrder = trackedOrders.find(o => o.id === selectedOrderId) || trackedOrders[0];

  const filteredOrders = trackedOrders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (newStatus: 'Processing' | 'In Transit' | 'Delivered') => {
    const updated = trackedOrders.map(o => {
      if (o.id === selectedOrder.id) {
        const updatedTimeline = { ...o.timeline };
        const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        if (newStatus === 'In Transit' && updatedTimeline.dispatchedTime === 'Pending') {
          updatedTimeline.dispatchedTime = nowStr;
        } else if (newStatus === 'Delivered') {
          updatedTimeline.deliveredTime = nowStr;
        }
        return { ...o, status: newStatus, timeline: updatedTimeline };
      }
      return o;
    });
    setTrackedOrders(updated);
    toast.success(`Order ${selectedOrder.id} status updated to ${newStatus}`);
  };

  const handleDownloadInvoice = () => {
    const invoiceText = `================================================
           SALES ORDER INVOICE
================================================
Invoice No:    INV-${selectedOrder.id}
Order ID:      ${selectedOrder.id}
Date:          ${selectedOrder.date}
Customer:      ${selectedOrder.customerName}
Tracking ID:   ${selectedOrder.trackingNumber}
Vehicle No:    ${selectedOrder.vehicle}
Driver:        ${selectedOrder.driver}
Total Items:   ${selectedOrder.items}
Total Amount:  ₹${selectedOrder.total.toLocaleString()}
Status:        ${selectedOrder.status}
================================================
Thank you for your order!
================================================`;
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${selectedOrder.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Invoice for ${selectedOrder.id} downloaded!`);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Order Tracking</h1>
        <p className="text-slate-500 dark:text-slate-400">Track shipments, live delivery progress, and consignments for all orders</p>
      </div>

      {/* Filter and Search Bar for Orders */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by order ID (e.g. ORD-002), customer, or tracking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'In Transit', 'Processing', 'Delivered'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab 
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Order View & Timeline Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of All Active Tracked Orders */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Orders Under Tracking ({filteredOrders.length})
            </span>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">Click order to view track details</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-500">
                No orders match your filter.
              </div>
            ) : (
              filteredOrders.map(order => {
                const isSelected = order.id === selectedOrder.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary-50/70 dark:bg-primary-950/40 border-primary-500 shadow-md ring-1 ring-primary-500'
                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-base">{order.id}</span>
                          <span className="text-xs font-mono text-slate-400">({order.trackingNumber})</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{order.customerName}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        order.status === 'In Transit' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      <span>{order.date} • {order.items} items</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Tracking Stages for the Selected Order */}
        <div className="lg:col-span-7">
          {selectedOrder && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-6">
              {/* Order Detail Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedOrder.id}</h2>
                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                      {selectedOrder.trackingNumber}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedOrder.customerName} • Placed on {selectedOrder.date} • ₹{selectedOrder.total.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => setIsPodModalOpen(true)}
                    className="flex-1 sm:flex-initial bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" /> Proof of Delivery
                  </button>
                  <button 
                    onClick={handleDownloadInvoice}
                    className="flex-1 sm:flex-initial bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" /> Invoice (PDF)
                  </button>
                </div>
              </div>

              {/* Vehicle & Consignment Info Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Vehicle Number</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{selectedOrder.vehicle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Assigned Driver</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedOrder.driver}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block mb-0.5">Current Stage</span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">{selectedOrder.status}</span>
                </div>
              </div>

              {/* Vertical Step Timeline */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {/* Step 1: Confirmed */}
                <div className="relative flex gap-4 items-start">
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Order Confirmed & Verified</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedOrder.timeline.confirmedTime}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Payment & items approved by sales operations.</p>
                  </div>
                </div>

                {/* Step 2: Packed */}
                <div className="relative flex gap-4 items-start">
                  <div className={`absolute -left-6 sm:-left-8 top-0.5 w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${
                    selectedOrder.status === 'Processing' || selectedOrder.status === 'In Transit' || selectedOrder.status === 'Delivered'
                      ? 'bg-blue-100 dark:bg-blue-950/80 border-2 border-blue-500'
                      : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600'
                  }`}>
                    <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Processing & Packed in Warehouse</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedOrder.timeline.packedTime}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Goods quality checked and safely boxed with tamper tape.</p>
                  </div>
                </div>

                {/* Step 3: Dispatched & In Transit */}
                <div className="relative flex gap-4 items-start">
                  <div className={`absolute -left-6 sm:-left-8 top-0.5 w-7 h-7 rounded-full flex items-center justify-center shadow-sm relative ${
                    selectedOrder.status === 'In Transit' || selectedOrder.status === 'Delivered'
                      ? 'bg-primary-100 dark:bg-primary-950/80 border-2 border-primary-500'
                      : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600'
                  }`}>
                    {selectedOrder.status === 'In Transit' && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-500 rounded-full animate-ping"></span>
                    )}
                    <Truck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dispatched & In Transit</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedOrder.timeline.dispatchedTime === 'Pending' ? 'Estimated: Today at 04:00 PM' : selectedOrder.timeline.dispatchedTime}
                    </p>
                    <div className="mt-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Consignment #{selectedOrder.trackingNumber}</p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">Vehicle: {selectedOrder.vehicle} • Driver: {selectedOrder.driver}</p>
                    </div>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className={`relative flex gap-4 items-start ${selectedOrder.status !== 'Delivered' ? 'opacity-60' : ''}`}>
                  <div className={`absolute -left-6 sm:-left-8 top-0.5 w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${
                    selectedOrder.status === 'Delivered'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500 text-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-400'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Delivered to Customer</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedOrder.timeline.deliveredTime}
                    </p>
                    {selectedOrder.status === 'Delivered' && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Customer verified and signed upon receipt.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stage Advance Action for testing/dispatch */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">Advance Dispatch Status:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus('Processing')}
                    className="px-2.5 py-1 text-xs rounded font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('In Transit')}
                    className="px-2.5 py-1 text-xs rounded font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200"
                  >
                    In Transit
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Delivered')}
                    className="px-2.5 py-1 text-xs rounded font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
                  >
                    Delivered
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proof of Delivery Modal */}
      {isPodModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Proof of Delivery (POD)</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload customer signature slip, delivery photo, or receiving stamp for {selectedOrder.id}.
            </p>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-900/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG or PDF (up to 5MB)</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPodModalOpen(false)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPodModalOpen(false);
                  toast.success(`Proof of delivery recorded for ${selectedOrder.id}!`);
                }}
                className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
              >
                Confirm POD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
