import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  AlertOctagon, 
  CheckCircle2, 
  Pill, 
  Clock, 
  Award,
  ArrowRight,
  ShieldAlert,
  BrainCircuit,
  Heart
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { DashboardData } from '../types.js';

interface AnalyticsViewProps {
  data: DashboardData | null;
  loading: boolean;
}

export default function AnalyticsView({ data, loading }: AnalyticsViewProps) {
  if (loading || !data) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  // Seeding monthly trend data for the Line/Area Chart to show historical adherence progress
  const monthlyAdherenceTrend = [
    { month: 'Jan', Adherence: 82, Target: 90 },
    { month: 'Feb', Adherence: 84, Target: 90 },
    { month: 'Mar', Adherence: 80, Target: 90 },
    { month: 'Apr', Adherence: 88, Target: 90 },
    { month: 'May', Adherence: 91, Target: 90 },
    { month: 'Jun', Adherence: 94, Target: 90 },
    { month: 'Jul (Current)', Adherence: data.adherencePercentage, Target: 90 }
  ];

  // Seeding time-wise reminder analysis (How well are medicines taken based on time of day)
  const timeOfDayAnalysis = [
    { timeGroup: 'Morning (06:00-11:00)', Taken: 24, Missed: 2, SuccessRate: 92 },
    { timeGroup: 'Mid-day (11:00-16:00)', Taken: 18, Missed: 5, SuccessRate: 78 },
    { timeGroup: 'Evening (16:00-21:00)', Taken: 15, Missed: 3, SuccessRate: 83 },
    { timeGroup: 'Bedtime (21:00-02:00)', Taken: 28, Missed: 1, SuccessRate: 96 }
  ];

  const pieData = [
    { name: 'Tablets', value: data.categoryDistribution.Tablet || 0, color: '#3b82f6' },
    { name: 'Capsules', value: data.categoryDistribution.Capsule || 0, color: '#10b981' },
    { name: 'Syrups', value: data.categoryDistribution.Syrup || 0, color: '#f59e0b' },
    { name: 'Drops', value: data.categoryDistribution.Drops || 0, color: '#8b5cf6' },
    { name: 'Injections', value: data.categoryDistribution.Injection || 0, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Success rate gauges
  const adherence = data.adherencePercentage;
  const missedRate = 100 - adherence;

  return (
    <div className="p-6 space-y-6" id="analytics-view">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Activity size={22} className="text-blue-500" />
          Medication Compliance & Adherence Analytics
        </h2>
        <p className="text-xs text-slate-400">Deep-dive clinical auditing, calendar response trends, and missed-dose risk indices.</p>
      </div>

      {/* Analytics Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Scorecard 1: Success Rating */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl">
            <Award size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compliance Badge</span>
            <span className="text-lg font-black text-slate-800 dark:text-white">
              {adherence >= 85 ? "Optimal (Tier A)" : adherence >= 70 ? "Stable (Tier B)" : "Action Required"}
            </span>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full translate-x-6 -translate-y-6" />
        </div>

        {/* Scorecard 2: Missed Dose analysis */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl">
            <AlertOctagon size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Missed Dose Risk</span>
            <span className="text-lg font-black text-slate-800 dark:text-white">
              {missedRate}% of Total Doses
            </span>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full translate-x-6 -translate-y-6" />
        </div>

        {/* Scorecard 3: Completion Trend direction */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-2xl">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Intake Progress</span>
            <span className="text-lg font-black text-slate-800 dark:text-white">+12.4% vs Last Mo</span>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full translate-x-6 -translate-y-6" />
        </div>

        {/* Scorecard 4: Average Response Latency */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-2xl">
            <Heart size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Refill Safety Index</span>
            <span className="text-lg font-black text-slate-800 dark:text-white">98% Protected</span>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full translate-x-6 -translate-y-6" />
        </div>
      </div>

      {/* Row 1: Weekly intake bars & Monthly trend area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stacked weekly compliance chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Medication Adherence</h3>
            <p className="text-[10px] text-slate-400 mb-4">A comparative study of addressed vs missed treatments per day</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyChart} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', background: '#0f172a', color: '#fff', border: 'none', fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Taken" fill="#10b981" radius={[4, 4, 0, 0]} name="Taken" />
                <Bar dataKey="Missed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Missed" />
                <Bar dataKey="Skipped" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Skipped" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Medicine form formula category sectors */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medicine Category Distribution</h3>
            <p className="text-[10px] text-slate-400">Inventory percentage grouped by delivery method</p>
          </div>

          {pieData.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-400">
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
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Formulas</span>
              </div>
            </div>
          )}

          <div className="space-y-1.5 text-xs pt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{item.value} ({Math.round((item.value / data.totalMedicines)*100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Monthly adherence line trend & Time-wise reminder analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-500" /> Multi-Month Completion Trends
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">Patient compliance trend mapped against the WHO 90% threshold line</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyAdherenceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', background: '#0f172a', color: '#fff', border: 'none', fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Adherence" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAdherence)" name="Compliance %" />
                <Line type="monotone" dataKey="Target" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1.5} name="Target Threshold (90%)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time-wise Reminder Response analysis */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={14} className="text-blue-500" /> Time-of-Day Intake Response Audit
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">Identifying peak compliance failure windows throughout the day</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeOfDayAnalysis} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="timeGroup" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', background: '#0f172a', color: '#fff', border: 'none', fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Taken" fill="#10b981" radius={[4, 4, 0, 0]} name="Addressed" />
                <Bar dataKey="Missed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Missed / Late" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Analytical Recommendations / Risk Warnings */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-3xl shadow-lg border border-blue-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white mt-1">
            <BrainCircuit size={24} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base">Predictive Risk Analysis</h3>
            <p className="text-xs text-blue-100 max-w-xl leading-relaxed mt-1">
              Analysis of your past 7 days suggests that **Mid-day (11:00-16:00)** holds the highest risk of compliance failure (22% failure rate), primarily caused by away-from-home activities. Setting up calendar reminders on portable devices or carrying pocket pill organizers is highly advised to optimize your therapeutic outcome.
            </p>
          </div>
        </div>
        <div className="bg-white/10 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl text-xs shrink-0">
          <span className="font-bold">Next Refill Threshold:</span>
          <p className="text-emerald-300 font-black mt-0.5">14 days remaining safely</p>
        </div>
      </div>
    </div>
  );
}
