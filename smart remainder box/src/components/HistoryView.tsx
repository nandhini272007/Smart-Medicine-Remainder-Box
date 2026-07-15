import React from 'react';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FileSpreadsheet
} from 'lucide-react';
import { ReminderHistoryEntry } from '../types.js';

interface HistoryViewProps {
  history: ReminderHistoryEntry[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearchChange: (q: string) => void;
  onStatusFilterChange: (status: string) => void;
  loading: boolean;
}

export default function HistoryView({
  history,
  totalPages,
  currentPage,
  onPageChange,
  onSearchChange,
  onStatusFilterChange,
  loading
}: HistoryViewProps) {
  const [searchVal, setSearchVal] = React.useState('');
  const [statusVal, setStatusVal] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchVal);
  };

  const handleStatusChange = (status: string) => {
    setStatusVal(status);
    onStatusFilterChange(status);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/4" />
        <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" id="history-view">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History size={22} className="text-blue-500" />
            Compliance Reminder History
          </h2>
          <p className="text-xs text-slate-400">Complete, chronological historical log auditing patient compliance patterns and notes.</p>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-grow">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search logs by medicine name, type, instructions..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition"
          />
        </form>

        {/* Status Quick Filter */}
        <div className="flex gap-2 shrink-0">
          {['', 'Taken', 'Missed', 'Skipped'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition ${
                statusVal === status 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
              }`}
            >
              {status === '' ? 'All Logs' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List of Logs */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-6">
        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <History size={40} className="stroke-1 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold">No historical records found</p>
            <p className="text-[10px] mt-0.5">Try adjusting your filters or search query terms.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-100 dark:border-slate-700 pl-6 ml-3 space-y-6" id="history-timeline">
            {history.map((log) => {
              const isTaken = log.status === 'Taken';
              const isSkipped = log.status === 'Skipped';
              const isMissed = log.status === 'Missed';

              return (
                <div key={log.id} className="relative group text-xs">
                  {/* Nodes dot */}
                  <span className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-4 border-white dark:border-slate-800 shadow-md ${
                    isTaken 
                      ? 'bg-emerald-500' 
                      : isSkipped 
                        ? 'bg-amber-500' 
                        : 'bg-rose-500'
                  }`} />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100/60 dark:border-slate-700/60 rounded-xl hover:shadow-sm hover:border-slate-200/50 dark:hover:border-slate-700 transition gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{log.medicineName}</span>
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md uppercase font-semibold">
                          {log.medicineType}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-medium">
                        <span>Required Dose: {log.dosage}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono font-bold text-slate-500 dark:text-slate-400">
                          🕒 {log.time}
                        </span>
                      </div>

                      {log.notes && (
                        <div className="mt-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed italic">
                          <MessageSquare size={12} className="text-slate-400 shrink-0 mt-0.5" />
                          <span>"{log.notes}"</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0 border-t sm:border-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-700">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${
                        isTaken 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-500/10' 
                          : isSkipped 
                            ? 'bg-amber-50 text-amber-600 border-amber-500/10' 
                            : 'bg-rose-50 text-rose-600 border-rose-500/10'
                      }`}>
                        {log.status}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar size={10} />
                        <span>{log.date} {log.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl shadow-sm text-xs text-slate-500">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
