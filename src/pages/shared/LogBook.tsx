import React, { useState } from 'react';
import { Search, Plus, BookOpen, Clock } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export interface LogEntry {
  id: string;
  date: string;
  entry: string;
  author: string;
  time: string;
}

export default function LogBook() {
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('salestrack_logbook', []);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const now = new Date();
    const newEntry: LogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      author: formData.get('author') as string, 
      entry: formData.get('entry') as string,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setLogs([newEntry, ...logs]); // add to top
    setModalOpen(false);
    toast.success('Log entry added');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Digital Log Book</h1>
          <p className="text-slate-500 dark:text-slate-400">Record daily activities, notes, and observations</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {logs.length === 0 ? (
        <EmptyState 
          title="No Log Entries" 
          description="The log book is currently empty. Record your first daily activity or note."
          icon={<BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          action={
            <button 
              onClick={() => setModalOpen(true)} 
              className="inline-block bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Write Entry
            </button>
          }
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/50">
          {logs.map(log => (
            <div key={log.id} className="p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                    {log.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{log.author}</h3>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2 mt-0.5">
                      <span>{log.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {log.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 pl-13 ml-13 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                {log.entry}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="New Log Entry">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Author Name</label>
            <input name="author" required className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Entry Details</label>
            <textarea name="entry" required className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" rows={5} placeholder="Write your log entry here..." />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-lg hover:bg-primary-700 shadow-sm shadow-primary-600/20 transition-colors">
              Save Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
