import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('admin@salestrack.com');
  const [password, setPassword] = useState('password');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/');
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address first to reset password');
      return;
    }
    toast.success('Password reset request sent to Admin for ' + email);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/my-background.jpg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay to make the login card stand out */}
      <div className="absolute inset-0 bg-slate-900/10"></div>

      <div className="max-w-md w-full bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-white/50">
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome to SalesTrack</h2>
          <p className="text-center text-slate-500 mb-8">Sign in to your account</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white/80 text-slate-900 outline-none"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white/80 text-slate-900 outline-none"
                required
              />
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white font-semibold py-2.5 rounded-lg hover:bg-primary-700 transition-colors shadow-md">
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 mb-2">Demo Logins:</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setEmail('admin@salestrack.com')} className="text-xs text-primary-600 font-medium hover:underline">Admin</button>
              <span className="text-slate-300">|</span>
              <button onClick={() => setEmail('john@salestrack.com')} className="text-xs text-primary-600 font-medium hover:underline">Sales Rep</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
