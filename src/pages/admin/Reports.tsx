import { Download, BarChart2, PieChart, LineChart } from 'lucide-react';

export default function Reports() {
  const reports = [
    { title: 'Sales Performance Report', desc: 'Monthly sales vs targets across all territories', icon: BarChart2, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Customer Visit Analysis', desc: 'Tracking of representative check-ins and conversion rates', icon: PieChart, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Expense Summary', desc: 'Breakdown of field expenses by category and employee', icon: LineChart, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-slate-500">Generate and export business insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${report.bg}`}>
              <report.icon className={`w-6 h-6 ${report.color}`} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{report.title}</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">{report.desc}</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary-50 text-primary-700 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 flex items-center justify-center gap-2">
                View
              </button>
              <button className="flex-1 bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
