import React, { useState } from 'react';
import { ShieldAlert, Download, Activity } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export default function Audit() {
  const [logs, setLogs] = useLocalStorage<AuditLog[]>('salestrack_audit', []);

  const handleExport = () => {
    if (logs.length === 0) {
      toast.error('No logs to export');
      return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,User,Action,Details\n" +
      logs.map(log => `${log.timestamp},${log.user},"${log.action}","${log.details}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Logs exported successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit & Security</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor system activity and changes</p>
        </div>
        <button 
          onClick={handleExport} 
          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Export Logs
        </button>
      </div>

      {logs.length === 0 ? (
        <EmptyState 
          title="No Activity Logs" 
          description="System events, logins, and data modifications will appear here. Everything looks secure."
          icon={<ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                  <th className="p-4 font-medium">Timestamp</th>
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Action</th>
                  <th className="p-4 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-sm">
                    <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{log.user}</td>
                    <td className="p-4 text-slate-900 dark:text-slate-200">{log.action}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
