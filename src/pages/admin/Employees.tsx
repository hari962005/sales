import React, { useState } from 'react';
import { UserPlus, MoreVertical, MapPin, Target, ArrowLeft, Calendar, Activity, Clock, Briefcase, Plus, X, Users, Edit2, TrendingUp, Navigation, ShieldCheck, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import type { AttendanceRecord } from '../shared/Attendance';

// Types
export interface Employee {
  id: string;
  name: string;
  role: string;
  territory: string;
  target: number;
  status: string;
  avatar: string;
  phone: string;
  email: string;
  joined: string;
}

export interface WorkflowActivity {
  id: string;
  time: string;
  action: string;
  details: string;
  type: 'check-in' | 'visit' | 'order' | 'expense';
}

export interface ScheduleItem {
  id: string;
  date: string;
  task: string;
  dealer: string;
  status: 'Pending' | 'Completed';
}

export default function Employees() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'workflow' | 'schedule' | 'performance' | 'attendance'>('workflow');
  
  // Local Storage State
  const [employees, setEmployees] = useLocalStorage<Employee[]>('salestrack_employees', []);
  const [attendanceRecords] = useLocalStorage<AttendanceRecord[]>('salestrack_attendance', []);
  const [workflows, setWorkflows] = useLocalStorage<Record<string, WorkflowActivity[]>>('salestrack_workflows', {});
  const [schedules, setSchedules] = useLocalStorage<Record<string, ScheduleItem[]>>('salestrack_schedules', {});
  
  // Add Employee Modal State
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: 'Sales Representative',
    territory: '',
    target: '',
    phone: '',
    email: ''
  });

  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ date: '', task: '', dealer: '' });

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee>>({});
  const [historyDate, setHistoryDate] = useState<'Today' | 'Yesterday' | 'Oct 10, 2023'>('Today');

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.territory || !newEmployee.phone || !newEmployee.email || !newEmployee.target) {
      toast.error('Please fill in all required fields');
      return;
    }

    const createdEmployee: Employee = {
      id: `EMP-${Date.now().toString().slice(-4)}`,
      name: newEmployee.name.trim(),
      role: newEmployee.role,
      territory: newEmployee.territory.trim(),
      target: Number(newEmployee.target) || 0,
      status: 'Active',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      phone: newEmployee.phone.trim(),
      email: newEmployee.email.trim(),
      joined: new Date().toLocaleDateString()
    };

    setEmployees(prev => [...prev, createdEmployee]);
    setNewEmployee({
      name: '',
      role: 'Sales Representative',
      territory: '',
      target: '',
      phone: '',
      email: ''
    });
    setIsAddEmployeeModalOpen(false);
    toast.success('Employee added successfully!');
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    const newEntry: ScheduleItem = {
      id: `s-${Date.now()}`,
      date: newSchedule.date,
      task: newSchedule.task,
      dealer: newSchedule.dealer,
      status: 'Pending'
    };

    setSchedules(prev => ({
      ...prev,
      [selectedEmployee.id]: [...(prev[selectedEmployee.id] || []), newEntry]
    }));
    
    setNewSchedule({ date: '', task: '', dealer: '' });
    setIsAddScheduleModalOpen(false);
    toast.success('Schedule added successfully!');
  };

  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    const updatedEmployee = { ...selectedEmployee, ...editingEmployee } as Employee;
    
    setEmployees(prev => prev.map(emp => 
      emp.id === selectedEmployee.id ? updatedEmployee : emp
    ));
    
    setSelectedEmployee(updatedEmployee);
    setIsEditProfileModalOpen(false);
    toast.success('Profile updated successfully!');
  };

  // ---------------------------------------------------------------------------
  // View: Master Employee List
  // ---------------------------------------------------------------------------
  if (!selectedEmployee) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employees</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your sales force</p>
          </div>
          <button 
            onClick={() => setIsAddEmployeeModalOpen(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Add Employee
          </button>
        </div>

        {employees.length === 0 ? (
          <EmptyState 
            title="No Employees Found" 
            description="You haven't added any sales employees yet. Add an employee to track their workflow and schedules."
            icon={<Users className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((emp) => (
              <div key={emp.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-all hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900/30 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{emp.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{emp.role}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="text-slate-500">Territory:</span> <span className="font-medium ml-1 text-slate-900 dark:text-white">{emp.territory}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                    <Target className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="text-slate-500">Target:</span> <span className="font-medium ml-1 text-slate-900 dark:text-white">₹{emp.target.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setActiveTab('workflow');
                    }}
                    className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setActiveTab('performance');
                    }}
                    className="flex-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                  >
                    Performance
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add Employee */}
        {isAddEmployeeModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Employee</h2>
                <button 
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. John Doe"
                    value={newEmployee.name}
                    onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Role <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    required
                    value={newEmployee.role}
                    onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Sales Representative">Sales Representative</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Area Manager">Area Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Territory <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. North Zone / Mumbai"
                    value={newEmployee.territory}
                    onChange={e => setNewEmployee({ ...newEmployee, territory: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Target (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="e.g. 100000"
                    value={newEmployee.target}
                    onChange={e => setNewEmployee({ ...newEmployee, target: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={newEmployee.phone}
                    onChange={e => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. john@example.com"
                    value={newEmployee.email}
                    onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddEmployeeModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // View: Detailed Employee Dashboard
  // ---------------------------------------------------------------------------
  const empWorkflow = workflows[selectedEmployee.id] || [];
  const empSchedule = schedules[selectedEmployee.id] || [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSelectedEmployee(null)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedEmployee.name}'s Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">{selectedEmployee.role} • {selectedEmployee.territory}</p>
        </div>
        <button 
          onClick={() => {
            setEditingEmployee(selectedEmployee);
            setIsEditProfileModalOpen(true);
          }}
          className="ml-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
        >
          <Edit2 className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      {/* Top Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <img src={selectedEmployee.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Status</div>
            <div className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedEmployee.status}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Monthly Target</div>
            <div className="font-semibold text-lg dark:text-white">₹{selectedEmployee.target.toLocaleString()}</div>
          </div>
          <Target className="w-8 h-8 text-primary-200 dark:text-primary-800" />
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 md:col-span-2">
          <div className="grid grid-cols-2 gap-4 h-full items-center">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Phone</div>
              <div className="font-medium text-sm dark:text-slate-200">{selectedEmployee.phone}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Email</div>
              <div className="font-medium text-sm dark:text-slate-200">{selectedEmployee.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'workflow' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" /> Today's Workflow
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'schedule' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" /> Day-to-Day Schedule
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'performance' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Performance
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'attendance' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <Clock className="w-4 h-4" /> Attendance & Duty Log
          </button>
        </nav>
      </div>

      {/* Tab Content: Workflow */}
      {activeTab === 'workflow' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Activity Timeline</h3>
          {empWorkflow.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No activity recorded for today.</p>
          ) : (
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-600 before:to-transparent">
              {empWorkflow.map((activity) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {activity.type === 'check-in' && <MapPin className="w-4 h-4" />}
                    {activity.type === 'visit' && <Briefcase className="w-4 h-4" />}
                    {activity.type === 'order' && <Target className="w-4 h-4" />}
                    {activity.type === 'expense' && <span className="text-sm font-bold">₹</span>}
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-slate-700/50 p-4 rounded border border-slate-200 dark:border-slate-600 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-900 dark:text-white">{activity.action}</div>
                      <time className="text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {activity.time}
                      </time>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-300">{activity.details}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Tasks & Visits</h3>
            <button 
              onClick={() => setIsAddScheduleModalOpen(true)}
              className="bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Schedule
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Task</th>
                  <th className="pb-3 font-medium">Dealer/Location</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {empSchedule.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      No schedule found for this employee.
                    </td>
                  </tr>
                ) : (
                  empSchedule.map(item => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="py-4 text-slate-900 dark:text-slate-200">{item.date}</td>
                      <td className="py-4 text-slate-900 dark:text-slate-200 font-medium">{item.task}</td>
                      <td className="py-4 text-slate-500 dark:text-slate-400">{item.dealer}</td>
                      <td className="py-4">
                        <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-medium">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Performance */}
      {activeTab === 'performance' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance Overview</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Monthly key performance metrics and sales achievement summary</p>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Monthly Target</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">₹{selectedEmployee.target.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Achievement</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">78%</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Visits Made</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">24</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Orders Placed</span>
              <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-1">18</p>
            </div>
          </div>

          {/* Target vs Achieved Progress Bar */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/60 dark:border-slate-700 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">Target vs Achieved</span>
              <span className="font-bold text-slate-900 dark:text-white">
                ₹{Math.round(selectedEmployee.target * 0.78).toLocaleString()} / ₹{selectedEmployee.target.toLocaleString()} (78%)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-primary-600 h-full rounded-full transition-all duration-500" 
                style={{ width: '78%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>₹0 (0%)</span>
              <span>₹{Math.round(selectedEmployee.target * 0.5).toLocaleString()} (50%)</span>
              <span>₹{selectedEmployee.target.toLocaleString()} (100%)</span>
            </div>
          </div>

          {/* Past Location History & GPS Audit Trail */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/60 dark:border-slate-700 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Past Location History & GPS Route Trail</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Chronological location logs and client visit checkpoints for {selectedEmployee.name}
                </p>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium">
                {(['Today', 'Yesterday', 'Oct 10, 2023'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setHistoryDate(d)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      historyDate === d
                        ? 'bg-primary-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Route Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Total Distance</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">26.4 km</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Checkpoints Logged</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">6 Locations</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Shift Window</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">09:00 AM - 05:30 PM</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">GPS Precision</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> High (±4m)
                </span>
              </div>
            </div>

            {/* Waypoints Timeline */}
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 pl-6">
              {[
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
              ].map((point, index) => (
                <div key={index} className="relative flex items-start justify-between bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                  <div className="absolute -left-6 top-3.5 w-3.5 h-3.5 rounded-full bg-primary-600 border-2 border-white dark:border-slate-900 shadow-xs"></div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{point.location}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${point.badgeColor}`}>
                        {point.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{point.activity}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {point.coords}
                      </span>
                      <span>Stop: {point.duration}</span>
                    </div>
                  </div>
                  <time className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 shrink-0 ml-2">
                    <Clock className="w-3.5 h-3.5" /> {point.time}
                  </time>
                </div>
              ))}
            </div>

            {/* Map Link Action */}
            <div className="pt-2 flex justify-end">
              <a 
                href="/tracking" 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Open Full GPS Route in Live Tracking Map <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Attendance */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                Attendance & Shift Logs: {selectedEmployee.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Shift check-in times, working hours, and field duty status
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          {(() => {
            const repRecords = attendanceRecords.filter(r => 
              (r.repName && r.repName.toLowerCase().includes(selectedEmployee.name.toLowerCase())) ||
              selectedEmployee.name.toLowerCase().includes((r.repName || '').toLowerCase())
            );
            const presentDays = repRecords.filter(r => r.status === 'Present').length;
            const leaveDays = repRecords.filter(r => r.status === 'Leave').length;

            return (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Total Shifts Logged</span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{repRecords.length || 3} shifts</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Days Present</span>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{presentDays || 3} Days</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Leaves Taken</span>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">{leaveDays} Days</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Avg. Working Hours</span>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-1">8.4 hrs/day</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Check In</th>
                        <th className="p-3.5">Check Out</th>
                        <th className="p-3.5">Working Hours</th>
                        <th className="p-3.5">Location / Hub</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-700/50">
                      {repRecords.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-400">
                            No individual records logged yet for {selectedEmployee.name}. They will reflect automatically upon duty check-in.
                          </td>
                        </tr>
                      ) : (
                        repRecords.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">{r.date}</td>
                            <td className="p-3.5 text-emerald-600 font-medium">{r.in}</td>
                            <td className="p-3.5 text-slate-600 dark:text-slate-400">{r.out}</td>
                            <td className="p-3.5 font-semibold">{r.hours}</td>
                            <td className="p-3.5 text-slate-500">{r.location || 'Territory Field Hub'}</td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                r.status === 'Present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                r.status === 'Leave' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Modal: Add Schedule */}
      {isAddScheduleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Task</h2>
              <button 
                onClick={() => setIsAddScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSchedule} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={newSchedule.date}
                  onChange={e => setNewSchedule({...newSchedule, date: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task / Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Follow up visit"
                  value={newSchedule.task}
                  onChange={e => setNewSchedule({...newSchedule, task: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dealer / Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Acme Corp"
                  value={newSchedule.dealer}
                  onChange={e => setNewSchedule({...newSchedule, dealer: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddScheduleModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
                >
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Profile */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profile</h2>
              <button 
                onClick={() => setIsEditProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  value={editingEmployee.name || ''}
                  onChange={e => setEditingEmployee({...editingEmployee, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <input 
                  type="text" 
                  required
                  value={editingEmployee.role || ''}
                  onChange={e => setEditingEmployee({...editingEmployee, role: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Territory</label>
                <input 
                  type="text" 
                  required
                  value={editingEmployee.territory || ''}
                  onChange={e => setEditingEmployee({...editingEmployee, territory: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                <input 
                  type="text" 
                  required
                  value={editingEmployee.phone || ''}
                  onChange={e => setEditingEmployee({...editingEmployee, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" 
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
