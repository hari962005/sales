import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, MapPin, Clock, Users, BrainCircuit, Sparkles, FileText,
  CalendarDays, Map, UserPlus, Target, Briefcase, PhoneCall, BarChart2, PieChart,
  ShoppingCart, Receipt, AlertCircle, Undo2, Package, Tag, CreditCard, UploadCloud,
  CalendarOff, CheckSquare, Calendar, Bell, MessageSquare, FolderOpen, Megaphone,
  HelpCircle, AlertTriangle, User, Settings, X, Plus, Check, Send, Download, Phone,
  ShieldAlert, ExternalLink, RefreshCw
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Order } from '../shared/Orders';
import type { AttendanceRecord } from '../shared/Attendance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function RepDashboard() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>('Detecting location...');
  const [orders] = useLocalStorage<Order[]>('salestrack_orders', []);
  const [dutyStatus, setDutyStatus] = useLocalStorage<'On Duty' | 'Checked Out'>('salestrack_duty_status', 'On Duty');
  const [checkInTime, setCheckInTime] = useLocalStorage<string>('salestrack_checkin_time', '09:00 AM');
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('salestrack_attendance', []);

  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Modals form states
  const [reportNotes, setReportNotes] = useState('Completed 5 planned client visits. Globex placed order for lubricants. Follow-up scheduled for Acme Industries tomorrow.');
  
  // Lead management state
  const [leads, setLeads] = useLocalStorage('salestrack_leads', [
    { id: '1', name: 'Metro Hardware', contact: 'Ramesh Gupta', phone: '+91 98231 44551', status: 'Qualified', potential: '₹45,000' },
    { id: '2', name: 'Apex Tool Co', contact: 'Sunil Rao', phone: '+91 98112 33445', status: 'Contacted', potential: '₹80,000' },
    { id: '3', name: 'Star Automotives', contact: 'Kiran Patel', phone: '+91 97441 55667', status: 'New', potential: '₹1,20,000' },
  ]);
  const [newLead, setNewLead] = useState({ name: '', contact: '', phone: '', potential: '' });

  // Follow-ups state
  const [followUps, setFollowUps] = useLocalStorage('salestrack_followups', [
    { id: '1', client: 'Acme Industries', type: 'Call', time: 'Today, 03:00 PM', note: 'Discuss bulk discount on Tools', done: false },
    { id: '2', client: 'Globex Corp', type: 'Visit', time: 'Tomorrow, 11:00 AM', note: 'Deliver product catalogue & sample', done: false },
    { id: '3', client: 'Horizon Traders', type: 'Payment', time: 'Oct 15, 02:00 PM', note: 'Collect outstanding balance ₹25,000', done: false },
  ]);

  // Tasks state
  const [tasks, setTasks] = useLocalStorage('salestrack_tasks', [
    { id: '1', text: 'Submit weekly travel allowance claim', done: false },
    { id: '2', text: 'Verify stock inventory for chemical batches', done: true },
    { id: '3', text: 'Call Acme Industries purchase manager', done: false },
    { id: '4', text: 'Log GPS check-in at North Zone warehouse', done: true },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // Leave request state
  const [leaveData, setLeaveData] = useState({ type: 'Casual Leave', from: '', to: '', reason: '' });

  // Upload bill state
  const [billData, setBillData] = useState({ category: 'Fuel', amount: '', notes: '' });

  // Quotation state
  const [quoteData, setQuoteData] = useState({ client: 'Acme Industries', product: 'Industrial Lubricant Batch-A', qty: '10', discount: '5' });

  // Calculate stats
  const todayOrders = orders.filter(o => o.date === new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
        () => setLocation('Location access granted')
      );
    }
  }, []);

  // Overview Action Handlers
  const handleNavigate = (clientName: string) => {
    toast.success(`Starting navigation route to ${clientName}...`);
    navigate('/tracking');
  };

  const handleCheckIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    setDutyStatus('On Duty');
    setCheckInTime(timeStr);

    // Synchronize to salestrack_attendance
    const existingIndex = attendanceRecords.findIndex(r => r.date === todayStr);
    if (existingIndex >= 0) {
      const updated = [...attendanceRecords];
      updated[existingIndex] = {
        ...updated[existingIndex],
        in: timeStr,
        status: 'Present'
      };
      setAttendanceRecords(updated);
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        date: todayStr,
        in: timeStr,
        out: '--:--',
        hours: 'In Progress',
        status: 'Present'
      };
      setAttendanceRecords([newRecord, ...attendanceRecords]);
    }

    toast.success(`Checked In successfully at ${timeStr}! Status: On Duty & Attendance Logged`);
  };

  const handleEndDay = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    setDutyStatus('Checked Out');

    // Update out time and hours in salestrack_attendance
    const existingIndex = attendanceRecords.findIndex(r => r.date === todayStr);
    if (existingIndex >= 0) {
      const updated = [...attendanceRecords];
      const rec = updated[existingIndex];
      updated[existingIndex] = {
        ...rec,
        out: timeStr,
        hours: '8 hrs 15 mins'
      };
      setAttendanceRecords(updated);
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        date: todayStr,
        in: checkInTime || '09:00 AM',
        out: timeStr,
        hours: '8 hrs 00 mins',
        status: 'Present'
      };
      setAttendanceRecords([newRecord, ...attendanceRecords]);
    }

    toast.success(`Day ended at ${timeStr}. Status: Checked Out & Attendance Logged`);
  };

  const handleSubmitDailyReport = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    toast.success('Daily report submitted successfully to Manager!');
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name) return;
    setLeads([...leads, { ...newLead, id: `L-${Date.now()}`, status: 'New' }]);
    setNewLead({ name: '', contact: '', phone: '', potential: '' });
    toast.success('New lead added to pipeline!');
  };

  const handleToggleFollowUp = (id: string) => {
    setFollowUps(followUps.map(f => f.id === id ? { ...f, done: !f.done } : f));
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: `t-${Date.now()}`, text: newTaskText, done: false }]);
    setNewTaskText('');
    toast.success('Task added!');
  };

  const handleActionClick = (action: { label: string; path: string }) => {
    if (action.path.startsWith('/')) {
      navigate(action.path);
    } else {
      // Open corresponding modal
      setActiveModal(action.label);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Hello, Sales Rep!</h1>
          <p className="text-slate-600 dark:text-slate-300">Here's your field activity summary for today.</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Monthly Target Achieved</p>
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
            45% (₹22,500 / ₹50,000)
          </p>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-1 shadow-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">AI Recommended Visits</h3>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800/30">
              <div>
                <p className="font-semibold text-purple-900 dark:text-purple-300">Globex Corp</p>
                <p className="text-xs text-purple-700 dark:text-purple-400">High probability of re-order (Low stock on Lubricant Batch-A)</p>
              </div>
              <button 
                onClick={() => handleNavigate('Globex Corp')} 
                className="bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-purple-700 transition-colors shadow-sm shadow-purple-600/20 flex items-center justify-center gap-1 self-start sm:self-auto"
              >
                <MapPin className="w-3.5 h-3.5" /> Navigate
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Acme Industries</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Follow-up reminder due today (Quote pending feedback)</p>
              </div>
              <button 
                onClick={() => handleNavigate('Acme Industries')} 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 self-start sm:self-auto"
              >
                <MapPin className="w-3.5 h-3.5" /> Navigate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('/customers')}
          className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <MapPin className="w-6 h-6 text-indigo-500 mb-2" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">5 / 12</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Customers Visited Today</p>
        </div>
        <div 
          onClick={() => navigate('/orders')}
          className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-300 transition-colors"
        >
          <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{todayOrders.length > 0 ? todayOrders.length : 3}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Orders Created Today</p>
        </div>
      </div>

      {/* Check In / Duty Card */}
      <div className={`${dutyStatus === 'On Duty' ? 'bg-primary-600' : 'bg-slate-700'} rounded-xl p-6 text-white flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden transition-colors`}>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
        
        <Clock className="w-8 h-8 mb-2 opacity-90 relative z-10" />
        <p className="text-primary-100 text-xs uppercase tracking-wider font-semibold mb-1 relative z-10">Current Status</p>
        <h2 className="text-2xl font-bold mb-2 relative z-10">{dutyStatus}</h2>
        <p className="text-xs text-white/80 mb-3 relative z-10">Check-in recorded at: <span className="font-semibold text-white">{checkInTime}</span></p>
        <div className="bg-white/20 px-4 py-1.5 rounded-full text-xs backdrop-blur-sm relative z-10 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>
        <div className="flex gap-3 mt-6 w-full max-w-sm relative z-10">
          <button 
            onClick={handleCheckIn}
            className={`flex-1 font-bold py-3 rounded-lg transition-colors shadow-sm text-sm ${
              dutyStatus === 'On Duty'
                ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
            }`}
          >
            Check In
          </button>
          <button 
            onClick={handleEndDay}
            className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20 text-sm"
          >
            End Day
          </button>
        </div>
      </div>

      {/* AI Daily Report Draft Card */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <BrainCircuit className="w-16 h-16 text-slate-100 dark:text-slate-700 opacity-60 transform rotate-12" />
        </div>
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <FileText className="w-4 h-4 text-primary-500 dark:text-primary-400" />
          <h3 className="font-bold text-slate-900 dark:text-white">Auto Daily Report</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed relative z-10">
          AI has automatically compiled your daily report based on your field GPS tracking and order submissions.
        </p>
        <button 
          onClick={() => setActiveModal('Daily Report')}
          className="w-full border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold py-2.5 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors relative z-10 shadow-sm"
        >
          Review & Submit Report
        </button>
      </div>

      {/* Field Operations Hub / App Launcher */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Field Operations Hub</h2>
        
        <div className="space-y-8">
          {[
            {
              title: "Customers & Visits",
              actions: [
                { label: "My Attendance", icon: CalendarDays, color: "text-indigo-500 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20", path: "/attendance" },
                { label: "Today's Route", icon: Map, color: "text-sky-500 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-900/20", path: "/tracking" },
                { label: "Customer List", icon: Users, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", path: "/customers" },
                { label: "Add Customer", icon: UserPlus, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", path: "/customers" },
                { label: "Lead Mgmt", icon: Target, color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", path: "#lead-mgmt" },
                { label: "Customer Visit", icon: Briefcase, color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20", path: "/visit" },
                { label: "Follow-Ups", icon: PhoneCall, color: "text-rose-500 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", path: "#follow-ups" },
              ]
            },
            {
              title: "Sales & Orders",
              actions: [
                { label: "Create Order", icon: ShoppingCart, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", path: "/create-order" },
                { label: "My Targets", icon: Target, color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", path: "#my-targets" },
                { label: "Performance", icon: BarChart2, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", path: "#performance" },
                { label: "Analytics", icon: PieChart, color: "text-indigo-500 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20", path: "/ai-insights" },
                { label: "Quotation", icon: FileText, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", path: "#quotation" },
                { label: "Invoices", icon: Receipt, color: "text-teal-500 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/20", path: "/orders" },
                { label: "Outstanding", icon: AlertCircle, color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", path: "/payments" },
                { label: "Returns", icon: Undo2, color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", path: "/returns" },
              ]
            },
            {
              title: "Inventory & Promos",
              actions: [
                { label: "Stock Check", icon: Package, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", path: "/products" },
                { label: "Offers", icon: Tag, color: "text-pink-500 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/20", path: "#offers" },
              ]
            },
            {
              title: "HR & Expenses",
              actions: [
                { label: "Expense Claims", icon: CreditCard, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-900/20", path: "/expenses" },
                { label: "Upload Bills", icon: UploadCloud, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", path: "#upload-bills" },
                { label: "Leave Request", icon: CalendarOff, color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20", path: "#leave-request" },
              ]
            },
            {
              title: "Tasks & Comms",
              actions: [
                { label: "Task Manager", icon: CheckSquare, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", path: "#task-manager" },
                { label: "Calendar", icon: Calendar, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", path: "#calendar" },
                { label: "Notifications", icon: Bell, color: "text-yellow-500 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20", path: "#notifications" },
                { label: "Messages", icon: MessageSquare, color: "text-indigo-500 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20", path: "#messages" },
                { label: "Documents", icon: FolderOpen, color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", path: "/documents" },
                { label: "Announcements", icon: Megaphone, color: "text-rose-500 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", path: "#announcements" },
              ]
            },
            {
              title: "Support & Safety",
              actions: [
                { label: "Raise Issue", icon: HelpCircle, color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", path: "/complaints" },
                { label: "SOS", icon: AlertTriangle, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", path: "#sos" },
                { label: "Profile", icon: User, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", path: "#profile" },
                { label: "Settings", icon: Settings, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", path: "#settings" },
              ]
            }
          ].map((category, catIdx) => (
            <div key={catIdx} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">{category.title}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
                {category.actions.map((action, actIdx) => (
                  <button 
                    key={actIdx} 
                    onClick={() => handleActionClick(action)}
                    className="flex flex-col items-center justify-start p-2 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 group"
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2 shadow-sm transition-transform group-hover:scale-105 ${action.bg}`}>
                      <action.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${action.color}`} />
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODALS */}
      {/* ============================================================== */}

      {/* 1. Daily Report Modal */}
      {activeModal === 'Daily Report' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Review & Submit Daily Report</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmitDailyReport} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Clients Visited</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">5 / 12</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Orders Created</span>
                  <p className="text-base font-bold text-emerald-600 mt-0.5">3 Orders (₹18,500)</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Field Summary & Remarks</label>
                <textarea 
                  rows={4}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700">Submit to Manager</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Lead Management Modal */}
      {activeModal === 'Lead Mgmt' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lead Management</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Add Lead Form */}
              <form onSubmit={handleAddLead} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Add Lead</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    required 
                    placeholder="Business Name" 
                    value={newLead.name} 
                    onChange={e => setNewLead({...newLead, name: e.target.value})}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input 
                    placeholder="Contact Person" 
                    value={newLead.contact} 
                    onChange={e => setNewLead({...newLead, contact: e.target.value})}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input 
                    placeholder="Phone" 
                    value={newLead.phone} 
                    onChange={e => setNewLead({...newLead, phone: e.target.value})}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input 
                    placeholder="Potential (e.g. ₹50,000)" 
                    value={newLead.potential} 
                    onChange={e => setNewLead({...newLead, potential: e.target.value})}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-orange-600 text-white rounded-lg text-xs font-semibold hover:bg-orange-700">
                  + Add to Pipeline
                </button>
              </form>

              {/* Leads list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Leads Pipeline ({leads.length})</h4>
                {leads.map(lead => (
                  <div key={lead.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{lead.name}</p>
                      <p className="text-slate-500">{lead.contact} • {lead.phone}</p>
                      <span className="text-orange-600 dark:text-orange-400 font-semibold">{lead.potential}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Follow-Ups Modal */}
      {activeModal === 'Follow-Ups' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Follow-Up Reminders</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-3">
              {followUps.map(f => (
                <div key={f.id} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{f.client}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">{f.type}</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">{f.time}</p>
                    <p className="text-slate-700 dark:text-slate-300 mt-1 italic">&ldquo;{f.note}&rdquo;</p>
                  </div>
                  <button 
                    onClick={() => handleToggleFollowUp(f.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                      f.done 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' 
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {f.done ? '✓ Done' : 'Mark Done'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. My Targets Modal */}
      {activeModal === 'My Targets' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Sales Target</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Target</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹50,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Achieved so far</span>
                  <span className="font-bold text-emerald-600">₹22,500 (45%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Remaining</span>
                  <span className="font-bold text-red-500">₹27,500</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mt-3">
                  <div className="bg-primary-600 h-full rounded-full transition-all" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                ⭐ <strong>Incentive Tier:</strong> Achieve 80% to qualify for quarterly bonus of ₹10,000!
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700">Close</button>
          </div>
        </div>
      )}

      {/* 5. Performance Modal */}
      {activeModal === 'Performance' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance Metrics</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <span className="text-blue-700 dark:text-blue-300">Conversion Rate</span>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100 mt-1">68%</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <span className="text-emerald-700 dark:text-emerald-300">Avg Order Size</span>
                <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">₹6,200</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                <span className="text-purple-700 dark:text-purple-300">Visits Completed</span>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100 mt-1">42 this month</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                <span className="text-amber-700 dark:text-amber-300">Customer Rating</span>
                <p className="text-xl font-bold text-amber-900 dark:text-amber-100 mt-1">4.9 / 5.0</p>
              </div>
            </div>
            <button onClick={() => navigate('/reports')} className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700">View Detailed Reports</button>
          </div>
        </div>
      )}

      {/* 6. Quotation Modal */}
      {activeModal === 'Quotation' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Price Quotation</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Customer / Dealer</label>
                <input 
                  value={quoteData.client} 
                  onChange={e => setQuoteData({...quoteData, client: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Product</label>
                <input 
                  value={quoteData.product} 
                  onChange={e => setQuoteData({...quoteData, product: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Quantity</label>
                  <input 
                    type="number"
                    value={quoteData.qty} 
                    onChange={e => setQuoteData({...quoteData, qty: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Discount %</label>
                  <input 
                    type="number"
                    value={quoteData.discount} 
                    onChange={e => setQuoteData({...quoteData, discount: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => {
                  setActiveModal(null);
                  toast.success(`Quotation generated and sent to ${quoteData.client}!`);
                }}
                className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
              >
                Generate & Share Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Promotional Offers Modal */}
      {activeModal === 'Offers' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Promotional Schemes</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800/40 rounded-xl text-xs">
                <span className="font-bold text-pink-700 dark:text-pink-300">🔥 Bulk Buyer Discount</span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">15% off on all industrial chemical barrels above 50 units order.</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 rounded-xl text-xs">
                <span className="font-bold text-purple-700 dark:text-purple-300">🎁 Buy 5 Get 1 Free</span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Special dealer bundle on heavy machinery PPE helmets.</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">⚡ Instant Payment Cashback</span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">2.5% instant discount on spot digital UPI/Card payment settlements.</p>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold">Close</button>
          </div>
        </div>
      )}

      {/* 8. Upload Bills Modal */}
      {activeModal === 'Upload Bills' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Expense Bills</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Expense Category</label>
                <select 
                  value={billData.category} 
                  onChange={e => setBillData({...billData, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                >
                  <option>Fuel</option>
                  <option>Travel</option>
                  <option>Food</option>
                  <option>Accommodation</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Bill Amount (₹)</label>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={billData.amount} 
                  onChange={e => setBillData({...billData, amount: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                />
              </div>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center bg-slate-50 dark:bg-slate-900/50">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-medium text-slate-700 dark:text-slate-300">Click to upload photo of fuel/food bill</p>
                <p className="text-slate-400 mt-1">Supports JPG, PNG up to 5MB</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setActiveModal(null);
                  toast.success('Bill receipt uploaded and submitted to expenses!');
                }}
                className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
              >
                Upload & Submit Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Leave Request Modal */}
      {activeModal === 'Leave Request' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Apply for Leave</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Leave Type</label>
                <select 
                  value={leaveData.type} 
                  onChange={e => setLeaveData({...leaveData, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">From Date</label>
                  <input 
                    type="date"
                    value={leaveData.from} 
                    onChange={e => setLeaveData({...leaveData, from: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">To Date</label>
                  <input 
                    type="date"
                    value={leaveData.to} 
                    onChange={e => setLeaveData({...leaveData, to: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Reason</label>
                <textarea 
                  rows={3}
                  placeholder="State reason for leave..."
                  value={leaveData.reason} 
                  onChange={e => setLeaveData({...leaveData, reason: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                />
              </div>
            </div>
            <button 
              onClick={() => {
                setActiveModal(null);
                toast.success('Leave request submitted to Manager!');
              }}
              className="w-full py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700"
            >
              Submit Leave Application
            </button>
          </div>
        </div>
      )}

      {/* 10. Task Manager Modal */}
      {activeModal === 'Task Manager' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Field Tasks</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input 
                placeholder="New task description..."
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border rounded-lg dark:bg-slate-900 dark:border-slate-700"
              />
              <button type="submit" className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700">Add</button>
            </form>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tasks.map(t => (
                <div key={t.id} onClick={() => handleToggleTask(t.id)} className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg flex items-center gap-3 cursor-pointer text-xs">
                  <input type="checkbox" checked={t.done} readOnly className="rounded text-primary-600" />
                  <span className={`flex-1 ${t.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{t.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold">Done</button>
          </div>
        </div>
      )}

      {/* 11. Calendar Modal */}
      {activeModal === 'Calendar' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Field Visit Schedule</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <span className="font-bold text-blue-700 dark:text-blue-300">Today, 11:30 AM</span>
                <p className="text-slate-600 dark:text-slate-300">Visit Globex Corp (Inventory Inspection)</p>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="font-bold text-slate-700 dark:text-slate-300">Tomorrow, 10:00 AM</span>
                <p className="text-slate-600 dark:text-slate-400">Visit Acme Industries (Quarterly Contract Review)</p>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="font-bold text-slate-700 dark:text-slate-300">Oct 16, 02:00 PM</span>
                <p className="text-slate-600 dark:text-slate-400">North Territory Sales Area Review Meeting</p>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700">Close</button>
          </div>
        </div>
      )}

      {/* 12. Notifications Modal */}
      {activeModal === 'Notifications' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Field Alerts & Notifications</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">Order #ORD-002 Dispatched</span>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">Driver Mike has picked up consignment for Globex Corp.</p>
              </div>
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <span className="font-bold text-amber-700 dark:text-amber-300">Price Update</span>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">Industrial Solvent revised +5% effective from tomorrow.</p>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold">Mark All Read</button>
          </div>
        </div>
      )}

      {/* 13. Messages Modal */}
      {activeModal === 'Messages' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Team Chat</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <span className="font-semibold text-primary-600 dark:text-primary-400">Area Manager:</span>
                <p className="mt-0.5 text-slate-800 dark:text-slate-200">Great work closing the Globex deal this morning! Push for Acme next.</p>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Warehouse Head:</span>
                <p className="mt-0.5 text-slate-800 dark:text-slate-200">Consignment #CON-8839 is on the truck and out for delivery.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input placeholder="Type a message..." className="flex-1 px-3 py-1.5 text-xs border rounded-lg dark:bg-slate-900 dark:border-slate-700" />
              <button onClick={() => toast.success('Message sent to team!')} className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold"><Send className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      )}

      {/* 14. Announcements Modal */}
      {activeModal === 'Announcements' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Company Announcements</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl">
                <span className="font-bold text-rose-700 dark:text-rose-300">📢 Q4 Sales Champion Contest</span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Top rep across North and South territories wins an all-expenses-paid international holiday trip!</p>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold">Dismiss</button>
          </div>
        </div>
      )}

      {/* 15. SOS Emergency Modal */}
      {activeModal === 'SOS' && (
        <div className="fixed inset-0 bg-red-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 border-2 border-red-500 animate-fade-in-up">
            <div className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-7 h-7" />
              <h3 className="text-xl font-bold">Emergency SOS Trigger</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Triggering SOS immediately alerts your Regional Manager, HQ Safety Center, and sends your live GPS coordinates ({location}).
            </p>
            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-300 space-y-1">
              <p>🚨 <strong>HQ Hotline:</strong> +91 1800 220 999</p>
              <p>🚑 <strong>Medical / Police:</strong> 112</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold">Cancel</button>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  toast.error('EMERGENCY SOS BROADCASTED! HQ Safety Team is alerted.');
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-red-600/30"
              >
                BROADCAST SOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 16. Profile Modal */}
      {activeModal === 'Profile' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Field Rep Profile</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center text-lg">
                  SR
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">John Doe</h4>
                  <p className="text-slate-500">ID: REP-409 • North Territory</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">+91 98765 43210</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">john.doe@salestrack.com</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500">Shift Hours:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">09:00 AM - 06:00 PM</span>
                </div>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700">Close</button>
          </div>
        </div>
      )}

      {/* 17. Settings Modal */}
      {activeModal === 'Settings' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Field App Settings</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">High-Precision GPS Tracking</p>
                  <p className="text-slate-400 text-[10px]">Refresh location every 60 seconds</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-primary-600" />
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Offline Cache & Sync</p>
                  <p className="text-slate-400 text-[10px]">Save visits and orders without network</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-primary-600" />
              </div>
            </div>
            <button 
              onClick={() => {
                setActiveModal(null);
                toast.success('Settings saved!');
              }}
              className="w-full py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
