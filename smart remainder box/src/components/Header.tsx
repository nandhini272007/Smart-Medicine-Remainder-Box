import React from 'react';
import { Search, Bell, Clock, User, LogOut, FileSearch, Pill, Stethoscope, ArrowRight } from 'lucide-react';
import { Medicine, ReminderHistoryEntry } from '../types.js';
import * as api from '../api.js';

interface HeaderProps {
  userName: string;
  clinicName: string;
  onNavigateToTab: (tab: string) => void;
  onSelectMedicine: (med: Medicine) => void;
}

export default function Header({ userName, clinicName, onNavigateToTab, onSelectMedicine }: HeaderProps) {
  const [time, setTime] = React.useState<Date>(new Date('2026-07-07T09:31:54-07:00'));
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<{ medicines: Medicine[]; history: ReminderHistoryEntry[] }>({ medicines: [], history: [] });
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Live clock simulation starting from the local baseline time
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live search handler
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ medicines: [], history: [] });
      return;
    }

    const performSearch = async () => {
      try {
        const medRes = await api.getMedicines({ q: searchQuery, limit: 5 });
        const histRes = await api.getHistory({ q: searchQuery, limit: 5 });
        setSearchResults({
          medicines: medRes.medicines,
          history: histRes.history
        });
      } catch (err) {
        console.error('Error conducting global search:', err);
      }
    };

    const delayDebounce = setTimeout(() => {
      performSearch();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    });
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95 dark:bg-slate-900/95" id="app-header">
      {/* Search Input Container */}
      <div className="relative w-full sm:w-80 md:w-96">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search size={18} />
        </div>
        <input
          type="text"
          id="global-search-input"
          placeholder="Search medicines, doctors, hospitals..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition duration-200"
        />

        {/* Global Search Results Dropdown */}
        {showDropdown && searchQuery.trim() && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl z-20 max-h-96 overflow-y-auto p-4 animate-in fade-in slide-in-from-top-2 duration-150" id="search-results-dropdown">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700 mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Search Results</span>
                <button className="text-[11px] text-blue-500 hover:underline" onClick={() => { setShowDropdown(false); setSearchQuery(''); }}>Clear</button>
              </div>

              {/* Medicines Matches */}
              <div className="mb-4">
                <h4 className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Pill size={12} /> Medicines ({searchResults.medicines.length})
                </h4>
                {searchResults.medicines.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 px-2 py-1">No matching medicines found.</p>
                ) : (
                  <div className="space-y-1">
                    {searchResults.medicines.map((med) => (
                      <div
                        key={med.id}
                        onClick={() => {
                          onSelectMedicine(med);
                          onNavigateToTab('medicines');
                          setShowDropdown(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition text-left"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{med.name} <span className="text-[10px] text-slate-400">({med.strength})</span></p>
                          <p className="text-[10px] text-slate-400">Prescribed by {med.doctorName}</p>
                        </div>
                        <ArrowRight size={14} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* History Logs Matches */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileSearch size={12} /> Reminder History ({searchResults.history.length})
                </h4>
                {searchResults.history.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 px-2 py-1">No matching history entries.</p>
                ) : (
                  <div className="space-y-1">
                    {searchResults.history.map((hist) => (
                      <div
                        key={hist.id}
                        onClick={() => {
                          onNavigateToTab('history');
                          setShowDropdown(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition text-left"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{hist.medicineName} - {hist.time}</p>
                          <p className="text-[10px] text-slate-400">Status: <span className={hist.status === 'Taken' ? 'text-emerald-500' : 'text-rose-500'}>{hist.status}</span> on {hist.date}</p>
                        </div>
                        <ArrowRight size={14} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Clock & Profile Container */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-end">
        {/* Live digital clock */}
        <div className="flex items-center space-x-2.5 bg-blue-50/50 dark:bg-blue-950/20 px-4 py-2 rounded-xl border border-blue-500/10" id="live-clock">
          <Clock size={16} className="text-blue-500 animate-pulse" />
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{formatTime(time)}</p>
            <p className="text-[10px] font-medium text-slate-400">{formatDate(time)}</p>
          </div>
        </div>

        {/* Separator line */}
        <div className="hidden sm:block h-8 w-px bg-slate-100 dark:bg-slate-800" />

        {/* User Card */}
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/40 p-1.5 pr-4 rounded-xl border border-slate-100 dark:border-slate-800/60" id="user-profile-badge">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-semibold text-sm rounded-lg flex items-center justify-center shadow-md">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">{userName || "Caregiver/Patient"}</h4>
            <p className="text-[9px] font-semibold text-blue-500 tracking-wide uppercase">{clinicName || "Patient Mode"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
