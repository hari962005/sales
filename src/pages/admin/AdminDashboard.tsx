import React, { useState } from 'react';
import { 
  Users, TrendingUp, ShoppingBag, Package, MapPin, Clock, ShieldCheck, 
  ExternalLink, X, Navigation, CheckCircle, Target, ArrowRight 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Employee } from './Employees';
import type { Order } from '../shared/Orders';
import type { Payment } from '../shared/Payments';
import type { AttendanceRecord } from '../shared/Attendance';
import { useNavigate } from 'react-router-dom';

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 6890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const defaultEmployees: Employee[] = [
  {
    id: 'EMP-101',
    name: 'John Doe',
    role: 'Sales Representative',
    territory: 'North Zone',
    target: 50000,
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=101',
    phone: '+91 98765 43210',
    email: 'john.doe@salestrack.com',
    joined: '12/01/2023'
  },
  {
    id: 'EMP-102',
    name: 'Jane Smith',
    role: 'Senior Sales Rep',
    territory: 'South Zone',
    target: 65000,
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=102',
    phone: '+91 98112 23344',
    email: 'jane.smith@salestrack.com',
    joined: '15/02/2023'
  },
  {
    id: 'EMP-103',
    name: 'Rajesh Kumar',
    role: 'Area Sales Manager',
    territory: 'West Zone',
    target: 80000,
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=103',
    phone: '+91 97223 34455',
    email: 'rajesh.kumar@salestrack.com',
    joined: '10/03/2023'
  }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [employees] = useLocalStorage<Employee[]>('salestrack_employees', defaultEmployees);
  const [orders] = useLocalStorage<Order[]>('salestrack_orders', []);
  const [payments] = useLocalStorage<Payment[]>('salestrack_payments', []);

  const [attendanceRecords] = useLocalStorage<AttendanceRecord[]>('salestrack_attendance', []);

  // Modal state for selected employee performance & location history
  const [selectedRep, setSelectedRep] = useState<Employee | null>(null);
  const [historyDate, setHistoryDate] = useState<'Today' | 'Yesterday' | 'Oct 10, 2023'>('Today');

  const displayEmployees = employees.length > 0 ? employees : defaultEmployees;
  const totalPayments = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const activeEmployees = displayEmployees.filter(e => e.status === 'Active').length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const presentTodayCount = attendanceRecords.filter(r => r.date === todayStr && r.status === 'Present').length;

  const kpis = [
    { title: "Total Collections", value: `₹${totalPayments.toFixed(2)}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Active Reps', value: `${activeEmployees}/${Math.max(displayEmployees.length, 1)}`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: "Today's Attendance", value: `${presentTodayCount > 0 ? presentTodayCount : activeEmployees} Present`, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Total Orders', value: orders.length.toString(), icon: Package, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const pastLocationWaypoints = [
    {
      time: '09:00 AM',
      location: 'North Zone Logistics Depot',
      coords: '28.6139° N, 77.2090° E',
      activity: 'Shift Check-in & Route Start',
      duration: '15 mins',
      badge: 'Duty Check-in',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
    },
    {
      time: '10:30 AM',
      location: 'Acme Industries (Industrial Estate Phase 2)',
      coords: '28.6215° N, 77.2185° E',
      activity: 'Customer Visit & Quote Review',
      duration: '50 mins',
      badge: 'Client Visit',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    },
    {
      time: '12:15 PM',
      location: 'Metro Tools & Industrial Supplies Hub',
      coords: '28.6320° N, 77.2290° E',
      activity: 'Stock Inspection & New Lead Interaction',
      duration: '40 mins',
      badge: 'Stock Audit',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    },
    {
      time: '01:45 PM',
      location: 'Highway Plaza Rest Area',
      coords: '28.6385° N, 77.2340° E',
      activity: 'Lunch & Transit Rest Stop',
      duration: '35 mins',
      badge: 'Rest Stop',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    },
    {
      time: '03:15 PM',
      location: 'Globex Corp (Commercial Complex, Fl 4)',
      coords: '28.6490° N, 77.2450° E',
      activity: 'Order Booking (Booked Order #ORD-002 - ₹12,500)',
      duration: '1 hr 10 mins',
      badge: 'Order Captured',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    },
    {
      time: '05:30 PM',
      location: 'Regional Area Branch / Head Office',
      coords: '28.6180° N, 77.2120° E',
      activity: 'Daily Wrap-up & Day Check-out',
      duration: '20 mins',
      badge: 'Duty Complete',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of your sales operations and field performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center transition-all hover:shadow-md">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${kpi.bg} dark:bg-opacity-20 mr-4`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Weekly Sales Performance</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-slate-800)', color: 'white' }} 
                  itemStyle={{ color: 'white' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
          
          <div className="space-y-6 flex-1">
            {orders.length === 0 && payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
                <p>No recent activities.</p>
              </div>
            ) : (
              <>
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Order <span className="text-primary-600 dark:text-primary-400">{order.id}</span> created</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">for {order.customerId} • {order.date}</p>
                    </div>
                  </div>
                ))}
                {payments.slice(0, 2).map((payment) => (
                  <div key={payment.id} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Payment <span className="text-emerald-600 dark:text-emerald-400">{payment.id}</span> received</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">₹{payment.amount.toFixed(2)} from {payment.customer} • {payment.date}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Employee Field Performance & Location History Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Sales Reps Performance & Field Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click &quot;Performance&quot; on any sales rep to inspect their target attainment and past GPS location history
            </p>
          </div>
          <button 
            onClick={() => navigate('/employees')}
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            Manage All Employees <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-500 dark:text-slate-400">
                <th className="p-3">Employee</th>
                <th className="p-3">Territory</th>
                <th className="p-3">Monthly Target</th>
                <th className="p-3">Achievement</th>
                <th className="p-3">Today's Attendance</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-700/60">
              {displayEmployees.map(emp => {
                const repAtt = attendanceRecords.find(r => r.date === todayStr && (r.repName === emp.name || emp.name.toLowerCase().includes((r.repName || '').toLowerCase())));
                const isPresent = repAtt ? repAtt.status === 'Present' : true;
                const checkTime = repAtt ? repAtt.in : '09:00 AM';

                return (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{emp.name}</p>
                          <p className="text-[11px] text-slate-400">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">{emp.territory}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">₹{emp.target.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="space-y-1 w-32">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">78%</span>
                          <span className="text-slate-400">₹{Math.round(emp.target * 0.78).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className={`inline-flex items-center gap-1 font-semibold ${isPresent ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                          <Clock className="w-3 h-3" /> {isPresent ? 'Present (On Duty)' : 'Leave'}
                        </span>
                        <span className="text-[10px] text-slate-400">In at {checkTime}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedRep(emp)}
                        className="bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <TrendingUp className="w-3.5 h-3.5" /> Performance & Location
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance & Past Location History Modal */}
      {selectedRep && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
              <div className="flex items-center gap-3">
                <img src={selectedRep.avatar} alt={selectedRep.name} className="w-10 h-10 rounded-full border border-slate-200" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedRep.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedRep.role} • {selectedRep.territory}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRep(null)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Performance KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Monthly Target</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-1">₹{selectedRep.target.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Achievement</span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">78% (₹{Math.round(selectedRep.target * 0.78).toLocaleString()})</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Visits Completed</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-1">24 visits</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Orders Booked</span>
                  <p className="text-base font-bold text-primary-600 dark:text-primary-400 mt-1">18 orders</p>
                </div>
              </div>

              {/* Target progress bar */}
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Target Progress</span>
                  <span className="font-bold text-slate-900 dark:text-white">78% Completed</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary-600 h-full rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              {/* Past Location History Section */}
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Employee Past Location History</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">GPS waypoints and visit audit trail for {selectedRep.name}</p>
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg text-xs">
                    {(['Today', 'Yesterday', 'Oct 10, 2023'] as const).map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setHistoryDate(d)}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                          historyDate === d
                            ? 'bg-primary-600 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day summary badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Distance</span>
                    <span className="font-bold text-slate-900 dark:text-white">26.4 km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Stops</span>
                    <span className="font-bold text-slate-900 dark:text-white">6 Locations</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Shift Duration</span>
                    <span className="font-bold text-slate-900 dark:text-white">8 hrs 30 mins</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">GPS Accuracy</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> High (±4m)
                    </span>
                  </div>
                </div>

                {/* Chronological Waypoints list */}
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 pl-6">
                  {pastLocationWaypoints.map((pt, i) => (
                    <div key={i} className="relative flex items-start justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs shadow-2xs">
                      <div className="absolute -left-6 top-3 w-3 h-3 rounded-full bg-primary-600 border-2 border-white dark:border-slate-900"></div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{pt.location}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pt.badgeColor}`}>
                            {pt.badge}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px]">{pt.activity}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> {pt.coords}
                          </span>
                          <span>Stop: {pt.duration}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 shrink-0 ml-2">
                        <Clock className="w-3.5 h-3.5" /> {pt.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 text-xs">
                  <button
                    onClick={() => {
                      setSelectedRep(null);
                      navigate('/tracking');
                    }}
                    className="text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    View Live Tracking Map <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedRep(null)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
