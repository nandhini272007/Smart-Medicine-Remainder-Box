import React from 'react';
import { 
  Pill, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  ArrowRight, 
  FileText, 
  FileSpreadsheet, 
  Database, 
  ShieldAlert,
  Sliders,
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { DashboardData, Reminder, Medicine } from '../types.js';

interface DashboardViewProps {
  data: DashboardData | null;
  loading: boolean;
  onNavigateToTab: (tab: string) => void;
  onSelectReminder: (reminder: Reminder) => void;
  onAction: (reminder: Reminder, action: 'Taken' | 'Skipped' | 'Missed', notes?: string) => void;
}

export default function DashboardView({ data, loading, onNavigateToTab, onSelectReminder, onAction }: DashboardViewProps) {
  if (loading || !data) {
    return (
      <div className="p-6 space-y-6 animate-pulse" id="dashboard-skeleton">
        {/* Header Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        {/* Middle Panels Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        </div>
        {/* Footer Panels Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Calculate colors for the circular adherence gauge
  const adherence = data.adherencePercentage;
  const strokeDashoffset = 251.2 - (251.2 * adherence) / 100;
  
  const getAdherenceColorClass = (val: number) => {
    if (val >= 85) return 'text-emerald-500';
    if (val >= 70) return 'text-blue-500';
    if (val >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getAdherenceBgClass = (val: number) => {
    if (val >= 85) return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-500/10';
    if (val >= 70) return 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 border-blue-500/10';
    if (val >= 50) return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-500/10';
    return 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-500/10';
  };

  // Convert category data to chart format
  const pieData = [
    { name: 'Tablets', value: data.categoryDistribution.Tablet || 0, color: '#3b82f6' },
    { name: 'Capsules', value: data.categoryDistribution.Capsule || 0, color: '#10b981' },
    { name: 'Syrups', value: data.categoryDistribution.Syrup || 0, color: '#f59e0b' },
    { name: 'Drops', value: data.categoryDistribution.Drops || 0, color: '#8b5cf6' },
    { name: 'Injections', value: data.categoryDistribution.Injection || 0, color: '#ef4444' }
  ].filter(item => item.value > 0);

  return (
    <div className="p-6 space-y-6" id="dashboard-view">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Clinical Dashboard
          </h2>
          <p className="text-xs text-slate-400">Real-time prescription analysis, schedule tracking, and medical recommendations.</p>
        </div>
        <div className="flex gap-2">
          <button 
            id="quick-add-btn"
            onClick={() => onNavigateToTab('add-reminder')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition"
          >
            <Plus size={14} /> Add Medicine
          </button>
          <button 
            id="quick-schedule-btn"
            onClick={() => onNavigateToTab('today-schedule')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Calendar size={14} /> Today's Schedule
          </button>
        </div>
      </div>

      {/* 1. Core Summary Stats Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="stats-grid">
        {/* Total Medicines Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden group hover:shadow-md transition">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl">
            <Pill size={22} className="group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Meds</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{data.totalMedicines}</span>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full translate-x-8 -translate-y-8" />
        </div>

        {/* Today's Scheduled Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden group hover:shadow-md transition">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-xl">
            <Calendar size={22} className="group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doses Today</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{data.todayMedicines}</span>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full translate-x-8 -translate-y-8" />
        </div>

        {/* Completed Today Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden group hover:shadow-md transition">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
            <CheckCircle size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{data.completedToday}</span>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8" />
        </div>

        {/* Missed Today Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden group hover:shadow-md transition">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl">
            <AlertTriangle size={22} className="animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Missed Doses</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{data.missedToday}</span>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-full translate-x-8 -translate-y-8" />
        </div>

        {/* Upcoming Today Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden group hover:shadow-md transition">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upcoming</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{data.upcomingRemindersCount}</span>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full translate-x-8 -translate-y-8" />
        </div>
      </div>

      {/* 2. Adherence & Recommendations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adherence Rate Circular Progress Gauge */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-full text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Adherence</h3>
            <p className="text-[10px] text-slate-400">Calculated prescription compliance rate</p>
          </div>

          <div className="relative flex items-center justify-center my-6">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="64"
                className="stroke-slate-100 dark:stroke-slate-700 fill-transparent"
                strokeWidth="10"
              />
              <circle
                cx="80"
                cy="80"
                r="64"
                className={`stroke-current ${getAdherenceColorClass(adherence)} fill-transparent transition-all duration-1000 ease-out`}
                strokeWidth="11"
                strokeDasharray="402"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-slate-800 dark:text-white">{adherence}%</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rate</span>
            </div>
          </div>

          <div className={`w-full py-2.5 rounded-xl border text-xs font-semibold ${getAdherenceBgClass(adherence)}`}>
            {adherence >= 85 ? "Excellent Compliance Status" : adherence >= 70 ? "Good Compliance Status" : "Refill & Take Warning"}
          </div>
        </div>

        {/* Smart Recommendations Engine Logs */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col justify-between" id="recommendations-container">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
              <Sparkles size={18} className="text-blue-500" />
              <div>
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Intelligent Recommendation Engine</h3>
                <p className="text-[10px] text-slate-400">Clinically formulated rule-based compliance tips</p>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[190px] overflow-y-auto pr-1">
              {data.recommendations.map((rec, i) => {
                const isCritical = rec.includes("CRITICAL") || rec.includes("Missed");
                const isLow = rec.includes("Low Stock");
                const isNearing = rec.includes("Nearing");
                return (
                  <div 
                    key={i} 
                    className={`p-3.5 rounded-xl text-xs flex gap-3 border ${
                      isCritical 
                        ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-500/15' 
                        : isLow 
                          ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-500/15'
                          : isNearing
                            ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/15'
                            : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/15'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCritical ? <ShieldAlert size={16} /> : <Activity size={16} />}
                    </div>
                    <div>
                      <p className="font-semibold leading-relaxed">{rec}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Daily compliance status:</span>
            <div className="flex items-center space-x-1.5 font-bold text-slate-700 dark:text-slate-200">
              <span>{data.completedToday}/{data.todayMedicines} completed</span>
              <div className="w-16 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${data.todayMedicines > 0 ? (data.completedToday / data.todayMedicines) * 100 : 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Adherence Intake Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Medication Adherence</h3>
              <p className="text-[10px] text-slate-400">Overview of the last 7 days of scheduled treatment</p>
            </div>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-semibold">
              Jun 30 - Jul 07
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyChart} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    background: '#0f172a', 
                    color: '#fff', 
                    border: 'none',
                    fontSize: '11px'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Taken" fill="#10b981" radius={[4, 4, 0, 0]} name="Taken" />
                <Bar dataKey="Missed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Missed" />
                <Bar dataKey="Skipped" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Skipped" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution pie chart */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medicine Formats</h3>
            <p className="text-[10px] text-slate-400">Distribution of prescribed formulas</p>
          </div>

          {pieData.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-400">
              <Pill size={30} className="stroke-1 mb-2 text-slate-300" />
              <p className="text-xs">No active medicines.</p>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} meds`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center flex flex-col">
                <span className="text-lg font-extrabold text-slate-800 dark:text-white">{data.totalMedicines}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Prescribed</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Upcoming Doses & Recent History Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next/Upcoming Doses list */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-blue-500" /> Upcoming Reminders
              </h3>
              <p className="text-[10px] text-slate-400">Doses scheduled for later today</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('today-schedule')}
              className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
            >
              Full Schedule <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-3 flex-grow overflow-y-auto max-h-[300px] pr-1">
            {data.upcomingReminders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <CheckCircle size={36} className="text-emerald-500 stroke-1 mb-2" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-0.5">All Doses Addressed!</h4>
                <p className="text-[10px]">No more upcoming reminders scheduled for today.</p>
              </div>
            ) : (
              data.upcomingReminders.map((rem, i) => (
                <div 
                  key={i} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl hover:shadow-sm hover:border-slate-200/60 dark:hover:border-slate-700/60 transition gap-4"
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Medicine Type Icons */}
                    <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold">
                      {rem.medicineType === 'Tablet' && <span className="text-sm">Tab</span>}
                      {rem.medicineType === 'Capsule' && <span className="text-sm">Cap</span>}
                      {rem.medicineType === 'Syrup' && <span className="text-sm">Syr</span>}
                      {rem.medicineType === 'Injection' && <span className="text-sm">Inj</span>}
                      {rem.medicineType === 'Drops' && <span className="text-sm">Drp</span>}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        {rem.medicineName}
                        <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 dark:bg-blue-950/45 px-1.5 py-0.5 rounded-md">
                          {rem.strength}
                        </span>
                      </h4>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-1 font-medium">
                        <span>Dosage: {rem.dosage}</span>
                        <span>•</span>
                        <span className="text-indigo-500">{rem.beforeAfterFood}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                      🕒 {rem.time}
                    </span>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => onAction(rem, 'Taken')}
                        className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                      >
                        Take
                      </button>
                      <button 
                        onClick={() => onAction(rem, 'Skipped')}
                        className="px-2.5 py-1 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent logs history activity */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Recent Activity</h3>
              <button 
                onClick={() => onNavigateToTab('history')}
                className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
              >
                Log History <ArrowRight size={12} />
              </button>
            </div>

            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
              {data.historySummary.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-10">No recent logging history.</p>
              ) : (
                <div className="relative border-l border-slate-100 dark:border-slate-700 pl-4 ml-2.5 space-y-4">
                  {data.historySummary.map((hist, i) => (
                    <div key={i} className="relative text-xs">
                      {/* Visual node status dot indicator */}
                      <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${
                        hist.status === 'Taken' 
                          ? 'bg-emerald-500' 
                          : hist.status === 'Skipped' 
                            ? 'bg-amber-500' 
                            : 'bg-rose-500'
                      }`} />
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">{hist.medicineName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Dosage: {hist.dosage}</p>
                          {hist.notes && (
                            <p className="text-[10px] italic text-slate-400 dark:text-slate-500 mt-0.5">"{hist.notes}"</p>
                          )}
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            hist.status === 'Taken' 
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                              : hist.status === 'Skipped' 
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' 
                                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                          }`}>
                            {hist.status}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono mt-1">{hist.date} {hist.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
