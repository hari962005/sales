import { useState } from 'react';
import { MapPin, Camera, FileText, CheckCircle, Clock } from 'lucide-react';

export default function CustomerVisit() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [notes, setNotes] = useState('');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Customer Visit</h1>
        <p className="text-slate-500">Record check-in, notes, and check-out</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Acme Corp</h2>
          <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" /> 123 Main St, North Territory
          </p>
        </div>

        <div className="p-6 space-y-6">
          {!isCheckedIn ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to start visit?</h3>
              <p className="text-slate-500 text-sm mb-6">Your GPS location will be recorded.</p>
              <button 
                onClick={() => setIsCheckedIn(true)}
                className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
              >
                Check In Now
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 p-4 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Checked In Successfully</span>
                </div>
                <span className="text-sm font-medium flex items-center gap-1"><Clock className="w-4 h-4"/> 10:45 AM</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Visit Notes & Outcome</label>
                <textarea 
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border-slate-200 rounded-lg p-3 border focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Discussed new product line, requested sample..."
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-slate-50 text-slate-700 py-3 rounded-lg font-medium border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100">
                  <Camera className="w-5 h-5" /> Add Photo
                </button>
                <button className="flex-1 bg-slate-50 text-slate-700 py-3 rounded-lg font-medium border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100">
                  <FileText className="w-5 h-5" /> Order
                </button>
              </div>

              <button 
                onClick={() => { alert('Visit completed!'); setIsCheckedIn(false); }}
                className="w-full bg-red-500 text-white py-3.5 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 mt-4"
              >
                End Visit & Check Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
