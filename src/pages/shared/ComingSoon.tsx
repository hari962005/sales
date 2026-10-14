import { Construction } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function ComingSoon() {
  const location = useLocation();
  const title = location.pathname.split('/').pop()?.replace('-', ' ').toUpperCase() || 'MODULE';

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center">
        <Construction className="w-10 h-10 text-primary-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="text-slate-500 max-w-md">
        This production module is fully architected in the backend layout and will be deployed in the next sprint.
      </p>
    </div>
  );
}
