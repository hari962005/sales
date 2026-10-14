import { BrainCircuit, TrendingUp, AlertTriangle, PackageSearch } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const forecastData = [
  { month: 'Jul', actual: 4000, forecast: null },
  { month: 'Aug', actual: 3000, forecast: null },
  { month: 'Sep', actual: 5000, forecast: null },
  { month: 'Oct', actual: 4500, forecast: 4500 },
  { month: 'Nov', actual: null, forecast: 5800 },
  { month: 'Dec', actual: null, forecast: 7200 },
];

const demandData = [
  { product: 'Lubricant 5L', demand: 85 },
  { product: 'Safety Gloves', demand: 45 },
  { product: 'Heavy Cleaner', demand: 92 },
  { product: 'Motor Oil', demand: 60 },
];

export default function AIInsights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <BrainCircuit className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Intelligence Hub</h1>
          <p className="text-slate-500">Machine learning powered predictions and anomaly detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Forecasting */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" /> Sales Forecasting
            </h3>
            <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">AI Model: Active</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={3} />
                <Line type="monotone" dataKey="forecast" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demand Prediction */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PackageSearch className="w-5 h-5 text-emerald-500" /> Demand Prediction
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="product" type="category" axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="demand" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unusual Transactions / Anomalies */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-red-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Unusual Transactions Detected
            </h3>
            <button className="text-sm font-medium text-red-600 hover:text-red-700">View Audit Log</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div>
                <p className="font-semibold text-red-900">Payment Flagged: PAY-108</p>
                <p className="text-sm text-red-700 mt-1">Transaction of $15,000 processed outside normal business hours (2:45 AM) from unverified IP.</p>
              </div>
              <button className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50">Review</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div>
                <p className="font-semibold text-amber-900">Inventory Anomaly: Heavy Cleaner</p>
                <p className="text-sm text-amber-700 mt-1">Stock depleted 400% faster than historical 30-day average.</p>
              </div>
              <button className="px-4 py-2 bg-white border border-amber-200 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-50">Investigate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
