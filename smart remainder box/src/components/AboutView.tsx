import React from 'react';
import { 
  Info, 
  Stethoscope, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Heart, 
  Wand2, 
  ArrowRight,
  Database,
  Brain,
  Smartphone,
  Mic
} from 'lucide-react';

export default function AboutView() {
  const enhancements = [
    { 
      title: "AI-based Drug Interaction Alerts", 
      desc: "Integrate Gemini models to scan candidate medicines against the user's active prescriptions to instantly alert caregivers about critical drug-to-drug contraindications.",
      icon: Brain
    },
    { 
      title: "Voice Medicine Assistant", 
      desc: "Enable natural speech recognition and text-to-speech to deliver conversational auditory reminder alarms, perfect for patients with visual or fine-motor impairments.",
      icon: Mic
    },
    { 
      title: "Caregiver Emergency Notification", 
      desc: "Instantly route emergency SMS or push notifications to verified caregivers' cell phones if three consecutive critical doses are marked as missed.",
      icon: ShieldCheck
    },
    { 
      title: "Wearable Device & Smartwatch Sync", 
      desc: "Sync treatment calendars with Apple Watch or Garmin bands to vibrate active compliance reminders directly on patients' wrists with single-tap completion logs.",
      icon: Smartphone
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 text-slate-800 dark:text-slate-100" id="about-view">
      {/* Brand Header */}
      <div className="text-center space-y-4 py-8 bg-gradient-to-tr from-slate-900 to-blue-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.12),transparent)] pointer-events-none" />
        <div className="mx-auto w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/10">
          <Stethoscope size={28} className="animate-pulse" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight">Smart Medicine Reminder System</h2>
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest">Enterprise Patient Compliance Suite</p>
        </div>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          An advanced medical prototype designed for clinics, caregivers, and hospitals to coordinate drug administrations, track compliance outcomes, and mitigate missed dose risks.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Pillar 1: Clinical Integrity */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm text-xs space-y-3">
          <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-200">Clinical Compliance</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Mitigate pharmacological errors and regimen failures. The system implements a robust dynamic compliance scorecard which audits compliance ratios in real-time.
          </p>
        </div>

        {/* Core Pillar 2: Dynamic Engine */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm text-xs space-y-3">
          <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl flex items-center justify-center">
            <Cpu size={18} />
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-200">Reminder Automation</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Eliminate pre-generating redundant tables. Our smart cron-engine analyzes repeat schedules (Daily, Weekly, Monthly) on-the-fly to compile customized daily checklists.
          </p>
        </div>

        {/* Core Pillar 3: Self-Contained DB */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm text-xs space-y-3">
          <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-xl flex items-center justify-center">
            <Database size={18} />
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-200">Durable Portability</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Relying on local JSON persistence on Node servers keeps system deployments completely self-contained, lightweight, and incredibly resilient to database connection dropouts.
          </p>
        </div>
      </div>

      {/* Future Roadmap / Enhancements Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-700">
          <Sparkles size={18} className="text-blue-500" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next-Generation Roadmap</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {enhancements.map((enh, i) => {
            const Icon = enh.icon;
            return (
              <div 
                key={i} 
                className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm flex gap-4 text-xs hover:border-blue-500/10 hover:shadow transition"
              >
                <div className="p-2 bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-blue-400 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center">
                  <Icon size={16} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-700 dark:text-slate-200">{enh.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">{enh.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical architecture footnotes */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 rounded-2xl flex gap-3.5 text-xs text-slate-500 leading-relaxed items-center">
        <Info size={18} className="text-slate-400 shrink-0" />
        <p className="text-[10px] dark:text-slate-400">
          **Developer Notes:** Built inside Node v22 and React 19. Tailwind v4 utility styles are compiled natively into Vite assets. All charts render dynamically using vector SVG calculations powered by Recharts.
        </p>
      </div>
    </div>
  );
}
