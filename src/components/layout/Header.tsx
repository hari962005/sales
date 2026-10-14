import { Search, Bell, Moon, Sun, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  const { mode, setMode, colorTheme, setColorTheme } = useTheme();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 transition-colors">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={onMenuClick} className="md:hidden">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers, orders, products..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all text-sm text-slate-900"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4 relative">
          {/* Theme Settings Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors flex items-center gap-2"
            >
              <Palette className="w-5 h-5 text-slate-600" />
            </button>
            
            {themeMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50">
                <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Color Theme</h4>
                <div className="flex gap-2 mb-4">
                  {(['blue', 'emerald', 'violet', 'rose'] as const).map(t => (
                    <button 
                      key={t}
                      onClick={() => { setColorTheme(t); setThemeMenuOpen(false); }}
                      className={`w-6 h-6 rounded-full ${
                        t === 'blue' ? 'bg-[#0ea5e9]' : 
                        t === 'emerald' ? 'bg-[#10b981]' : 
                        t === 'violet' ? 'bg-[#8b5cf6]' : 'bg-[#f43f5e]'
                      } ${colorTheme === t ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                    />
                  ))}
                </div>
                <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Mode</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setMode('light'); setThemeMenuOpen(false); }}
                    className={`flex-1 py-1.5 flex justify-center items-center rounded-lg text-sm font-medium ${mode === 'light' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Sun className="w-4 h-4 mr-1"/> Light
                  </button>
                  <button 
                    onClick={() => { setMode('dark'); setThemeMenuOpen(false); }}
                    className={`flex-1 py-1.5 flex justify-center items-center rounded-lg text-sm font-medium ${mode === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Moon className="w-4 h-4 mr-1"/> Dark
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => toast('No new notifications')} className="relative p-2 hover:bg-slate-50 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="relative p-2 hover:bg-slate-50 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4 lg:pl-6">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="User" className="w-9 h-9 rounded-full border border-slate-200" />
          </div>
        </div>
      </header>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Settings">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Application Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Push Notifications</span>
                <input type="checkbox" className="form-checkbox text-primary-600 rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Location Tracking</span>
                <input type="checkbox" className="form-checkbox text-primary-600 rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Offline Sync</span>
                <input type="checkbox" className="form-checkbox text-primary-600 rounded" defaultChecked />
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Account Security</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all text-sm text-slate-900 dark:text-white" />
              </div>
            </div>
            <button onClick={() => { setIsSettingsOpen(false); toast.success('Password successfully changed'); }} className="mt-4 w-full py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
              Update Password
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
