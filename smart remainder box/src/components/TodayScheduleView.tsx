import React from 'react';
import { 
  CalendarCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Info,
  Layers,
  Sparkles,
  ArrowRight,
  MessageSquare,
  FileCheck
} from 'lucide-react';
import { Reminder } from '../types.js';

interface TodayScheduleViewProps {
  schedule: Reminder[];
  loading: boolean;
  onAction: (reminder: Reminder, action: 'Taken' | 'Skipped' | 'Missed', notes?: string) => void;
  completedCount: number;
  missedCount: number;
  skippedCount: number;
  pendingCount: number;
  adherencePercentage: number;
}

export default function TodayScheduleView({
  schedule,
  loading,
  onAction,
  completedCount,
  missedCount,
  skippedCount,
  pendingCount,
  adherencePercentage
}: TodayScheduleViewProps) {
  const [activeLogId, setActiveLogId] = React.useState<string | null>(null);
  const [logNotes, setLogNotes] = React.useState('');
  const [currentHourMin, setCurrentHourMin] = React.useState('09:30');

  // Hardcoded current baseline time 09:30 for calculations
  // In a real app we might poll the system time, but we synchronize with our header clock context
  React.useEffect(() => {
    // Sync time slightly or keep static 09:30 baseline
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Helper: Calculate countdown to scheduled times based on baseline 09:30
  const getCountdownText = (timeStr: string) => {
    const baseHour = 9;
    const baseMin = 30;
    
    const [tHour, tMin] = timeStr.split(':').map(Number);
    
    const baseTotalMins = baseHour * 60 + baseMin;
    const targetTotalMins = tHour * 60 + tMin;
    
    const diff = targetTotalMins - baseTotalMins;
    
    if (diff === 0) {
      return "Due Now";
    } else if (diff > 0) {
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return `In ${hours > 0 ? `${hours}h ` : ''}${mins}m`;
    } else {
      const absDiff = Math.abs(diff);
      const hours = Math.floor(absDiff / 60);
      const mins = absDiff % 60;
      return `Overdue by ${hours > 0 ? `${hours}h ` : ''}${mins}m`;
    }
  };

  const handleLogAction = (rem: Reminder, action: 'Taken' | 'Skipped' | 'Missed') => {
    onAction(rem, action, logNotes);
    setActiveLogId(null);
    setLogNotes('');
  };

  return (
    <div className="p-6 space-y-6 text-slate-800 dark:text-slate-100" id="today-schedule-view">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CalendarCheck size={22} className="text-blue-500" />
            Today's Clinical Intake Checklist
          </h2>
          <p className="text-xs text-slate-400">Track, authorize, and document active medical regimens scheduled for July 07, 2026.</p>
        </div>
        <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          📅 Date Context: 2026-07-07
        </span>
      </div>

      {/* Adherence Overview Micro-Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Compliance Gauge Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl shadow-sm flex items-center space-x-3 sm:col-span-1 lg:col-span-1">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl">
            <FileCheck size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Today's Adherence</span>
            <span className="text-lg font-black text-slate-800 dark:text-white">{adherencePercentage}%</span>
          </div>
        </div>

        {/* Counter cards */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl shadow-sm flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Taken</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-200">{completedCount} doses</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl shadow-sm flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Missed</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-200">{missedCount} doses</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl shadow-sm flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Skipped</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-200">{skippedCount} doses</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl shadow-sm flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Pending</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-200">{pendingCount} doses</span>
          </div>
        </div>
      </div>

      {/* Doses List */}
      <div className="space-y-4" id="today-schedule-list">
        {schedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm">
            <CalendarCheck size={44} className="text-slate-300 stroke-1 mb-2" />
            <h4 className="font-bold text-slate-700 dark:text-slate-200">No Reminders for Today</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-0.5">There are no medication schedules registered for today's date context. Configure a medicine's repeating timeline to populate this checklist.</p>
          </div>
        ) : (
          schedule.map((rem, i) => {
            const isTaken = rem.status === 'Taken';
            const isSkipped = rem.status === 'Skipped';
            const isMissed = rem.status === 'Missed';
            const isPending = rem.status === 'Pending';
            const isOverdue = isPending && rem.time < currentHourMin;
            const logPanelActive = activeLogId === `${rem.medicineId}-${rem.time}`;

            return (
              <div 
                key={i}
                className={`bg-white dark:bg-slate-800 border rounded-2xl shadow-sm overflow-hidden transition duration-200 ${
                  isTaken 
                    ? 'border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-950/5' 
                    : isSkipped 
                      ? 'border-amber-500/20 bg-amber-50/5 dark:bg-amber-950/5'
                      : isMissed 
                        ? 'border-rose-500/20 bg-rose-50/5 dark:bg-rose-950/5'
                        : isOverdue 
                          ? 'border-rose-500/20 dark:border-rose-700/50'
                          : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
                }`}
              >
                {/* Dosing Main Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Medicine Meta */}
                  <div className="flex items-center space-x-4">
                    {/* Medicine Image or Fallback */}
                    {rem.image ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 dark:border-slate-700 flex-shrink-0">
                        <img src={rem.image} alt={rem.medicineName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {rem.medicineType.slice(0, 3)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{rem.medicineName}</h3>
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/35 px-2 py-0.5 rounded-md uppercase">
                          {rem.strength}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">
                          {rem.beforeAfterFood}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-1 font-medium">
                        <span>Dose Required: {rem.dosage}</span>
                        <span>•</span>
                        <span>Stock: {rem.quantity} left</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Timings */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 border-slate-50 dark:border-slate-700">
                    <div className="flex flex-col items-start sm:items-end font-sans">
                      <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        🕒 {rem.time}
                      </span>
                      {isPending && (
                        <span className={`text-[10px] font-bold ${isOverdue ? 'text-rose-500 animate-pulse' : 'text-blue-500'}`}>
                          {getCountdownText(rem.time)}
                        </span>
                      )}
                    </div>

                    {/* Status Badge OR Actions panel */}
                    <div className="flex items-center gap-2">
                      {isPending ? (
                        <>
                          <button 
                            onClick={() => {
                              setActiveLogId(logPanelActive ? null : `${rem.medicineId}-${rem.time}`);
                              setLogNotes('');
                            }}
                            className="px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition"
                          >
                            Mark Action
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                            isTaken 
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/10' 
                              : isSkipped 
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-500/10' 
                                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-500/10'
                          }`}>
                            {isTaken && <CheckCircle size={12} />}
                            {isSkipped && <Clock size={12} />}
                            {isMissed && <XCircle size={12} />}
                            {rem.status}
                          </span>
                          
                          {/* Allow changing status if desired */}
                          <button 
                            onClick={() => {
                              setActiveLogId(`${rem.medicineId}-${rem.time}`);
                              setLogNotes(rem.notes || '');
                            }}
                            className="text-[10px] font-bold text-slate-400 hover:text-blue-500 transition underline"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Action Notes Input */}
                {logPanelActive && (
                  <div className="px-5 pb-5 pt-1.5 border-t border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-grow">
                        <MessageSquare size={14} className="absolute left-3 top-2.5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Add log notes (e.g. Took with water, feeling nauseous...)"
                          value={logNotes}
                          onChange={(e) => setLogNotes(e.target.value)}
                          className="w-full pl-8 pr-4 py-1.5 text-xs bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                      <div className="flex gap-2.5 justify-end">
                        <button 
                          onClick={() => handleLogAction(rem, 'Taken')}
                          className="px-3.5 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition font-bold"
                        >
                          Taken
                        </button>
                        <button 
                          onClick={() => handleLogAction(rem, 'Skipped')}
                          className="px-3.5 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-bold"
                        >
                          Skipped
                        </button>
                        <button 
                          onClick={() => handleLogAction(rem, 'Missed')}
                          className="px-3.5 py-1.5 text-xs bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition font-bold"
                        >
                          Missed
                        </button>
                        <button 
                          onClick={() => setActiveLogId(null)}
                          className="px-2.5 py-1.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
