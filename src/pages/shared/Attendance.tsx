import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, Plus, Search, 
  UserCheck, Download, ChevronRight, MapPin, ShieldCheck, History 
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export interface AttendanceRecord {
  id: string;
  repName?: string;
  role?: string;
  territory?: string;
  date: string;
  in: string;
  out: string;
  hours: string;
  status: 'Present' | 'Leave' | 'Absent' | 'Half Day';
  location?: string;
}

const defaultInitialRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    repName: 'John Doe',
    role: 'Sales Representative',
    territory: 'North Zone',
    date: new Date().toISOString().split('T')[0],
    in: '09:00 AM',
    out: '--:--',
    hours: 'In Progress',
    status: 'Present',
    location: 'North Zone Logistics Depot'
  },
  {
    id: 'att-2',
    repName: 'Jane Smith',
    role: 'Senior Sales Rep',
    territory: 'South Zone',
    date: new Date().toISOString().split('T')[0],
    in: '09:15 AM',
    out: '--:--',
    hours: 'In Progress',
    status: 'Present',
    location: 'South Zone Commercial Complex'
  },
  {
    id: 'att-3',
    repName: 'Rajesh Kumar',
    role: 'Area Sales Manager',
    territory: 'West Zone',
    date: new Date().toISOString().split('T')[0],
    in: '08:45 AM',
    out: '--:--',
    hours: 'In Progress',
    status: 'Present',
    location: 'West Industrial Hub'
  },
  {
    id: 'att-4',
    repName: 'John Doe',
    role: 'Sales Representative',
    territory: 'North Zone',
    date: '2023-10-11',
    in: '09:05 AM',
    out: '05:30 PM',
    hours: '8 hrs 25 mins',
    status: 'Present',
    location: 'North Zone Distribution Center'
  },
  {
    id: 'att-5',
    repName: 'Jane Smith',
    role: 'Senior Sales Rep',
    territory: 'South Zone',
    date: '2023-10-11',
    in: '09:00 AM',
    out: '05:45 PM',
    hours: '8 hrs 45 mins',
    status: 'Present',
    location: 'South Zone Trade Center'
  },
  {
    id: 'att-6',
    repName: 'John Doe',
    role: 'Sales Representative',
    territory: 'North Zone',
    date: '2023-10-10',
    in: '09:10 AM',
    out: '05:35 PM',
    hours: '8 hrs 25 mins',
    status: 'Present',
    location: 'North Zone Logistics Depot'
  },
  {
    id: 'att-7',
    repName: 'Rajesh Kumar',
    role: 'Area Sales Manager',
    territory: 'West Zone',
    date: '2023-10-10',
    in: '--:--',
    out: '--:--',
    hours: '0 hrs',
    status: 'Leave',
    location: 'N/A (Approved Leave)'
  }
];

export default function Attendance() {
  const [records, setRecords] = useLocalStorage<AttendanceRecord[]>('salestrack_attendance', defaultInitialRecords);
  const [dutyStatus, setDutyStatus] = useLocalStorage<'On Duty' | 'Checked Out'>('salestrack_duty_status', 'On Duty');
  const [checkInTime, setCheckInTime] = useLocalStorage<string>('salestrack_checkin_time', '09:00 AM');

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Present' | 'Leave' | 'Absent'>('All');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // Manual Check-in Form
  const [newLog, setNewLog] = useState({
    repName: 'John Doe',
    date: new Date().toISOString().split('T')[0],
    in: '09:00 AM',
    out: '--:--',
    status: 'Present' as 'Present' | 'Leave' | 'Absent',
    location: 'North Zone Hub'
  });

  const handleQuickCheckIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    setDutyStatus('On Duty');
    setCheckInTime(timeStr);

    const existingIndex = records.findIndex(r => r.date === todayStr && (r.repName === 'John Doe' || !r.repName));
    if (existingIndex >= 0) {
      const updated = [...records];
      updated[existingIndex] = {
        ...updated[existingIndex],
        in: timeStr,
        status: 'Present',
        hours: 'In Progress'
      };
      setRecords(updated);
    } else {
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}`,
        repName: 'John Doe',
        role: 'Sales Representative',
        territory: 'North Zone',
        date: todayStr,
        in: timeStr,
        out: '--:--',
        hours: 'In Progress',
        status: 'Present',
        location: 'Current Field GPS Location'
      };
      setRecords([newRec, ...records]);
    }
    toast.success(`Check-in recorded at ${timeStr}! Status: On Duty`);
  };

  const handleQuickCheckOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    setDutyStatus('Checked Out');

    const existingIndex = records.findIndex(r => r.date === todayStr && (r.repName === 'John Doe' || !r.repName));
    if (existingIndex >= 0) {
      const updated = [...records];
      updated[existingIndex] = {
        ...updated[existingIndex],
        out: timeStr,
        hours: '8 hrs 30 mins'
      };
      setRecords(updated);
    } else {
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}`,
        repName: 'John Doe',
        role: 'Sales Representative',
        territory: 'North Zone',
        date: todayStr,
        in: checkInTime || '09:00 AM',
        out: timeStr,
        hours: '8 hrs 30 mins',
        status: 'Present',
        location: 'Current Field GPS Location'
      };
      setRecords([newRec, ...records]);
    }
    toast.success(`Check-out recorded at ${timeStr}! Duty Ended.`);
  };

  const handleManualAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      repName: newLog.repName,
      role: 'Sales Representative',
      territory: 'Assigned Territory',
      date: newLog.date,
      in: newLog.in,
      out: newLog.out || '--:--',
      hours: newLog.out && newLog.out !== '--:--' ? '8 hrs 00 mins' : 'In Progress',
      status: newLog.status,
      location: newLog.location
    };
    setRecords([record, ...records]);
    setIsCheckInModalOpen(false);
    toast.success('Attendance record added successfully!');
  };

  // Filter records
  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      (r.repName || 'John Doe').toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.date.includes(searchQuery) ||
      (r.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const presentCount = records.filter(r => r.status === 'Present').length;
  const leaveCount = records.filter(r => r.status === 'Leave').length;
  const onDutyReps = records.filter(r => r.hours === 'In Progress' || r.out === '--:--').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            Attendance & Shift Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Live duty status tracking, GPS check-ins, and employee working hours
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="flex-1 sm:flex-initial bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 shadow-2xs"
          >
            <Plus className="w-4 h-4 text-primary-600" /> Log Attendance
          </button>
          
          {dutyStatus === 'On Duty' ? (
            <button
              onClick={handleQuickCheckOut}
              className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Clock className="w-4 h-4" /> End Day / Check Out
            </button>
          ) : (
            <button
              onClick={handleQuickCheckIn}
              className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Check In Now
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Your Current Status</span>
            <span className={`w-2.5 h-2.5 rounded-full ${dutyStatus === 'On Duty' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{dutyStatus}</p>
          <span className="text-[11px] text-slate-400">Checked in at {checkInTime}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Currently On Duty</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{onDutyReps} Reps</p>
          <span className="text-[11px] text-slate-400">Active in the field today</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Present Records</span>
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-1">{presentCount}</p>
          <span className="text-[11px] text-slate-400">Logged attendances</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Leaves / Offs</span>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{leaveCount}</p>
          <span className="text-[11px] text-slate-400">Approved time-offs</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xs border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Employee, Date (YYYY-MM-DD), or Check-in Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {(['All', 'Present', 'Leave', 'Absent'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-primary-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      {filteredRecords.length === 0 ? (
        <EmptyState 
          title="No Attendance Records Found" 
          description="No attendance logs match your filter criteria. Try clearing filters or recording a new check-in."
          icon={<Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Check In</th>
                  <th className="p-4">Check Out</th>
                  <th className="p-4">Working Hours</th>
                  <th className="p-4">Location / Hub</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-xs">
                          {(r.repName || 'John Doe').charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{r.repName || 'John Doe'}</p>
                          <p className="text-[11px] text-slate-400">{r.role || 'Sales Representative'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {r.in}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {r.out}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${r.hours === 'In Progress' ? 'text-blue-600 dark:text-blue-400 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                        {r.hours}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                        <span className="truncate max-w-[180px]">{r.location || 'North Zone Depot'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${
                        r.status === 'Present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                        r.status === 'Leave' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        r.status === 'Half Day' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {r.status === 'Present' && <CheckCircle2 className="w-3 h-3" />}
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Add Log Modal */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" /> Log Attendance / Duty Record
              </h3>
              <button 
                onClick={() => setIsCheckInModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualAddLog} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Employee Name</label>
                <select
                  value={newLog.repName}
                  onChange={e => setNewLog({ ...newLog, repName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="John Doe">John Doe (Sales Representative - North)</option>
                  <option value="Jane Smith">Jane Smith (Senior Sales Rep - South)</option>
                  <option value="Rajesh Kumar">Rajesh Kumar (Area Sales Manager - West)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={newLog.date}
                    onChange={e => setNewLog({ ...newLog, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Status</label>
                  <select
                    value={newLog.status}
                    onChange={e => setNewLog({ ...newLog, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Present">Present</option>
                    <option value="Leave">Leave</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Check In Time</label>
                  <input
                    type="text"
                    value={newLog.in}
                    onChange={e => setNewLog({ ...newLog, in: e.target.value })}
                    placeholder="e.g. 09:00 AM"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Check Out Time</label>
                  <input
                    type="text"
                    value={newLog.out}
                    onChange={e => setNewLog({ ...newLog, out: e.target.value })}
                    placeholder="e.g. 05:30 PM"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Check-in Location / Hub</label>
                <input
                  type="text"
                  value={newLog.location}
                  onChange={e => setNewLog({ ...newLog, location: e.target.value })}
                  placeholder="e.g. North Zone Logistics Depot"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCheckInModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
