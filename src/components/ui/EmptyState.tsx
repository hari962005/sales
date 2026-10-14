import React from 'react';
import { FileSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({ 
  title, 
  description, 
  icon = <FileSearch className="w-12 h-12 text-slate-300 dark:text-slate-600" />,
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 animate-fade-in-up">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">{description}</p>
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}
