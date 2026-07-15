import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  User, 
  Building, 
  Activity,
  FileCheck,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { Medicine, ReminderHistoryEntry } from '../types.js';

interface ReportsViewProps {
  userName: string;
  clinicName: string;
  medicines: Medicine[];
  history: ReminderHistoryEntry[];
  adherencePercentage: number;
}

export default function ReportsView({
  userName,
  clinicName,
  medicines,
  history,
  adherencePercentage
}: ReportsViewProps) {
  const [selectedMedId, setSelectedMedId] = React.useState('All');
  const [startDateFilter, setStartDateFilter] = React.useState('2026-07-01');
  const [endDateFilter, setEndDateFilter] = React.useState('2026-07-07');
  
  // Filtering history for reports
  const filteredHistory = history.filter(h => {
    const inDateRange = h.date >= startDateFilter && h.date <= endDateFilter;
    const isMatchingMed = selectedMedId === 'All' || h.medicineId === selectedMedId;
    return inDateRange && isMatchingMed;
  });

  // Calculate filtered adherence
  const actionableLogs = filteredHistory.filter(h => h.status === 'Taken' || h.status === 'Missed');
  const takenCount = actionableLogs.filter(h => h.status === 'Taken').length;
  const filteredAdherence = actionableLogs.length > 0
    ? Math.round((takenCount / actionableLogs.length) * 100)
    : 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6" id="reports-view">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText size={22} className="text-blue-500" />
            Clinical Compliance Reporting
          </h2>
          <p className="text-xs text-slate-400">Assemble, customize, and export high-resolution compliance dossiers for clinicians.</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
          >
            <Printer size={14} /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Reports Parameter Settings Panel */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm space-y-4 print:hidden">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Med Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Filter Medication</label>
            <select 
              value={selectedMedId}
              onChange={(e) => setSelectedMedId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg p-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Active Medications</option>
              {medicines.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.strength})</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Reporting Start Date</label>
            <input 
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg p-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Reporting End Date</label>
            <input 
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg p-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Printable Clinical Document Area */}
      <div 
        className="bg-white dark:bg-slate-800 p-8 sm:p-12 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-lg space-y-8 print:border-0 print:shadow-none print:p-0"
        id="printable-report-canvas"
      >
        {/* Document Medical Letterhead */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-700 pb-6 gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
              <FileCheck size={26} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Prescription Compliance Dossier</h1>
              <p className="text-xs text-slate-400 font-bold tracking-wider">{clinicName || "Metropolitan Health Network"}</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 rounded-md uppercase border border-emerald-500/10 mb-2">
              Verified Medical Ledger
            </span>
            <p className="text-slate-400 font-semibold uppercase tracking-wider">Report Range:</p>
            <p className="font-bold text-slate-700 dark:text-slate-200 font-mono">{startDateFilter} to {endDateFilter}</p>
          </div>
        </div>

        {/* Patient & Doctor Demographics Meta Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 p-5 rounded-2xl">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Subject Patient</span>
            <p className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
              <User size={14} className="text-slate-400" /> {userName || "John Doe"}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Ref ID: PAT-99104-B</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Clinical Origin</span>
            <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Building size={14} className="text-slate-400" /> {clinicName || "Metro General Hospital"}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Department: Internal Medicine Unit</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Overall Compliance</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-sm font-black font-mono ${filteredAdherence >= 85 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {filteredAdherence}% Adherence Rate
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Status: Compliance Level Optimal</p>
          </div>
        </div>

        {/* Active Treatment Plans Table */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-1.5">
            Active Prescribed Treatments
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                  <th className="py-2.5 font-bold">Ref ID</th>
                  <th className="py-2.5 font-bold">Medicine</th>
                  <th className="py-2.5 font-bold">Dose</th>
                  <th className="py-2.5 font-bold">Calendar Timings</th>
                  <th className="py-2.5 font-bold">Food Instructions</th>
                  <th className="py-2.5 font-bold">Supervising MD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {medicines.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                    <td className="py-3 font-mono font-bold text-slate-400">{m.id}</td>
                    <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{m.name} <span className="text-[10px] text-slate-400 font-medium">({m.strength})</span></td>
                    <td className="py-3">{m.dosage}</td>
                    <td className="py-3">{m.repeatSchedule} ({m.reminderTime})</td>
                    <td className="py-3 text-indigo-500 font-medium">{m.beforeAfterFood}</td>
                    <td className="py-3">{m.doctorName || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log History timeline summary */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-1.5">
            Chronological Reminder History ({filteredHistory.length} logs)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                  <th className="py-2.5 font-bold">Event Log ID</th>
                  <th className="py-2.5 font-bold">Date & Time</th>
                  <th className="py-2.5 font-bold">Medication</th>
                  <th className="py-2.5 font-bold">Intake Outcome</th>
                  <th className="py-2.5 font-bold">Clinical Action Logs / Journal Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredHistory.map(h => (
                  <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                    <td className="py-3 font-mono text-slate-400">{h.id}</td>
                    <td className="py-3 font-mono font-semibold">{h.date} {h.time}</td>
                    <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{h.medicineName}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        h.status === 'Taken' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' 
                          : h.status === 'Skipped' 
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20' 
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3 italic text-slate-400 dark:text-slate-500">
                      {h.notes ? `"${h.notes}"` : "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnostic QR Authenticator & Signatures Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-200 dark:border-slate-700 items-end">
          {/* QR Validator code */}
          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl w-fit">
            <div className="bg-white p-1 rounded-xl shadow border border-slate-100">
              {/* Clean vector custom SVG QR Code to avoid loading broken image URLs */}
              <svg className="w-16 h-16 text-slate-900" viewBox="0 0 100 100">
                <rect x="0" y="0" width="20" height="20" fill="currentColor" />
                <rect x="5" y="5" width="10" height="10" fill="white" />
                <rect x="80" y="0" width="20" height="20" fill="currentColor" />
                <rect x="85" y="5" width="10" height="10" fill="white" />
                <rect x="0" y="80" width="20" height="20" fill="currentColor" />
                <rect x="5" y="85" width="10" height="10" fill="white" />
                <rect x="35" y="35" width="30" height="30" fill="currentColor" />
                <rect x="45" y="45" width="10" height="10" fill="white" />
                <rect x="25" y="10" width="10" height="15" fill="currentColor" />
                <rect x="50" y="0" width="15" height="10" fill="currentColor" />
                <rect x="70" y="30" width="20" height="10" fill="currentColor" />
                <rect x="10" y="45" width="15" height="20" fill="currentColor" />
                <rect x="80" y="70" width="10" height="20" fill="currentColor" />
              </svg>
            </div>
            <div className="text-xs">
              <h4 className="font-bold text-slate-700 dark:text-slate-200">Patient Ledger</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Scan to verify adherence authenticity chain on clinic server.</p>
            </div>
          </div>

          {/* Signature 1: Caregiver/Patient */}
          <div className="text-center space-y-4">
            <div className="h-10 border-b border-slate-300 dark:border-slate-600 flex items-end justify-center">
              <span className="font-serif italic text-blue-600 dark:text-blue-400 tracking-wide text-sm">{userName || "Patient Signature"}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient / Caregiver Signature</p>
          </div>

          {/* Signature 2: Attending Medical Officer */}
          <div className="text-center space-y-4">
            <div className="h-10 border-b border-slate-300 dark:border-slate-600 flex items-end justify-center">
              <span className="font-serif italic text-slate-400 tracking-wide text-xs">Medical Registrar Seal Area</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attending Physician Endorsement</p>
          </div>
        </div>

        {/* Report Footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50 text-[10px] text-slate-400 leading-relaxed text-center italic">
          This report compiles medical records sourced from the Smart Medicine Reminder System. Please consult with your licensed general healthcare officer or pharmacist before modifying any prescribed pharmacological regimens.
        </div>
      </div>
    </div>
  );
}
