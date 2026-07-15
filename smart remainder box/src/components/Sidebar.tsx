import React from 'react';
import { 
  LayoutDashboard, 
  Pill, 
  PlusCircle, 
  CalendarCheck, 
  History, 
  FileText, 
  Activity, 
  Settings as SettingsIcon, 
  Info,
  Menu,
  X,
  Stethoscope
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clinicName: string;
}

export default function Sidebar({ activeTab, setActiveTab, clinicName }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'add-reminder', label: 'Add Reminder', icon: PlusCircle },
    { id: 'today-schedule', label: "Today's Schedule", icon: CalendarCheck },
    { id: 'history', label: 'Reminder History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <>
      {/* Mobile Header Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 transition" onClick={() => setIsOpen(!isOpen)} id="sidebar-toggle-btn">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:sticky md:h-screen`}
        id="app-sidebar"
      >
        <div>
          {/* Logo Brand Area */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
              <Stethoscope size={24} className="animate-pulse" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-lg leading-tight tracking-tight text-white">Smart Reminder</h1>
              <p className="text-[10px] text-blue-400 font-medium uppercase tracking-wider">{clinicName || "Medical Suite"}</p>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                    window.location.hash = item.id;
                  }}
                  className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-medium transition duration-200 group relative ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info panel */}
        <div className="p-4 border-t border-slate-800">
          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800/60 text-center">
            <span className="inline-block px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-400 font-semibold uppercase tracking-wider rounded-md border border-emerald-500/20 mb-1.5 animate-pulse">
              System Online
            </span>
            <p className="text-xs text-slate-400 font-medium font-sans">v1.1 Stable Build</p>
          </div>
        </div>
      </aside>
    </>
  );
}
