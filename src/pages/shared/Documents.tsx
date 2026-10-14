import React, { useState } from 'react';
import { Search, Plus, FileText, Download, Upload, FolderOpen } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export interface Document {
  id: string;
  title: string;
  type: string;
  uploadDate: string;
  size: string;
}

export default function Documents() {
  const [documents, setDocuments] = useLocalStorage<Document[]>('salestrack_documents', []);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = formData.get('file') as File;
    
    if (!fileInput || fileInput.size === 0) {
      toast.error('Please select a valid file');
      return;
    }

    // Mocking file upload
    const newDoc: Document = {
      id: `DOC-${Date.now().toString().slice(-6)}`,
      title: fileInput.name || 'Untitled Document',
      type: fileInput.name?.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      size: `${(fileInput.size / 1024 / 1024).toFixed(2)} MB`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    setDocuments([newDoc, ...documents]);
    setModalOpen(false);
    toast.success('Document uploaded successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and share files securely</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {documents.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-2 px-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2 max-w-md">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="flex-1 border-none focus:ring-0 py-2 outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400" 
          />
        </div>
      )}

      {documents.length === 0 ? (
        <EmptyState 
          title="No Documents Found" 
          description="Your document library is empty. Upload PDFs, images, or office documents to share with your team."
          icon={<FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-600" />}
          action={
            <button 
              onClick={() => setModalOpen(true)} 
              className="inline-block bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Upload First Document
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col items-center text-center transition-all hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900/30 group">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 w-full truncate" title={doc.title}>
                {doc.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                {doc.type} • {doc.size} • {doc.uploadDate}
              </p>
              <button className="w-full bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-600">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Upload Document">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select File</label>
            <input 
              type="file" 
              name="file" 
              required 
              className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-400" 
            />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-lg hover:bg-primary-700 shadow-sm shadow-primary-600/20 transition-colors">
              Upload
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
