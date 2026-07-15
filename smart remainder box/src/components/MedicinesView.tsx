import React from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  FileText, 
  User, 
  Building2, 
  Calendar, 
  Clock, 
  AlertCircle, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  X,
  Plus,
  Pill
} from 'lucide-react';
import { Medicine } from '../types.js';

interface MedicinesViewProps {
  medicines: Medicine[];
  totalMedicines: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearchChange: (q: string) => void;
  onFilterChange: (filters: { type?: string; repeatSchedule?: string; beforeAfterFood?: string }) => void;
  onEdit: (med: Medicine) => void;
  onDelete: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
  selectedMedFromGlobalSearch: Medicine | null;
  clearSelectedMedFromGlobalSearch: () => void;
}

export default function MedicinesView({
  medicines,
  totalPages,
  currentPage,
  onPageChange,
  onSearchChange,
  onFilterChange,
  onEdit,
  onDelete,
  onNavigateToTab,
  selectedMedFromGlobalSearch,
  clearSelectedMedFromGlobalSearch
}: MedicinesViewProps) {
  const [searchVal, setSearchVal] = React.useState('');
  const [filterType, setFilterType] = React.useState('');
  const [filterSchedule, setFilterSchedule] = React.useState('');
  const [filterFood, setFilterFood] = React.useState('');
  const [selectedMed, setSelectedMed] = React.useState<Medicine | null>(null);
  const [showFilters, setShowFilters] = React.useState(false);

  // Sync with global search selection if redirected
  React.useEffect(() => {
    if (selectedMedFromGlobalSearch) {
      setSelectedMed(selectedMedFromGlobalSearch);
      clearSelectedMedFromGlobalSearch();
    }
  }, [selectedMedFromGlobalSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchVal);
  };

  const applyFilters = () => {
    onFilterChange({
      type: filterType || undefined,
      repeatSchedule: filterSchedule || undefined,
      beforeAfterFood: filterFood || undefined
    });
  };

  const clearFilters = () => {
    setFilterType('');
    setFilterSchedule('');
    setFilterFood('');
    onFilterChange({});
  };

  return (
    <div className="p-6 space-y-6" id="medicines-view">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Prescribed Medicines</h2>
          <p className="text-xs text-slate-400">Manage, search, and audit your complete prescription formulary catalogue.</p>
        </div>
        <button 
          onClick={() => onNavigateToTab('add-reminder')}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition font-semibold"
        >
          <Plus size={14} /> Add Medicine
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by medicine name, doctor, hospital..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition duration-200"
            />
          </div>
          <div className="flex gap-2">
            <button 
              type="submit"
              className="px-4 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-sm"
            >
              Search
            </button>
            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3.5 py-2.5 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition ${
                showFilters 
                  ? 'bg-slate-800 border-slate-800 text-white dark:bg-slate-700' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </form>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Filter by Type */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Medicine Form</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 dark:text-slate-200"
              >
                <option value="">All Types</option>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Drops">Drops</option>
                <option value="Injection">Injection</option>
              </select>
            </div>

            {/* Filter by Schedule */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Repeat Schedule</label>
              <select 
                value={filterSchedule} 
                onChange={(e) => setFilterSchedule(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 dark:text-slate-200"
              >
                <option value="">All Schedules</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            {/* Filter by Food Relationship */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Meal Timing</label>
              <select 
                value={filterFood} 
                onChange={(e) => setFilterFood(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 dark:text-slate-200"
              >
                <option value="">Any Timing</option>
                <option value="Before Food">Before Food</option>
                <option value="After Food">After Food</option>
                <option value="With Food">With Food</option>
              </select>
            </div>

            <div className="col-span-1 sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={clearFilters}
                className="px-3 py-1.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 transition"
              >
                Reset
              </button>
              <button 
                onClick={applyFilters}
                className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Medicines Bento Grid */}
      {medicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm">
          <AlertCircle size={44} className="text-slate-300 mb-3 stroke-1" />
          <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">No Medications Found</h4>
          <p className="text-xs text-slate-400 max-w-sm">No prescriptions match your current search filters. Add a new reminder to begin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="medicines-grid">
          {medicines.map((med) => (
            <div 
              key={med.id}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition relative group"
            >
              {/* Card Banner / Image */}
              <div className="h-24 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-950/40 dark:to-indigo-950/40 p-4 flex justify-between items-start border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm tracking-tight">{med.name}</h3>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{med.type}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md uppercase">
                  {med.id}
                </span>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-3 flex-grow text-xs">
                <div className="grid grid-cols-2 gap-3.5 border-b border-slate-50 dark:border-slate-700/50 pb-3">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Strength / Dose</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{med.strength} ({med.dosage})</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Stock Qty</span>
                    <span className={`font-bold ${med.quantity <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-700 dark:text-slate-200'}`}>
                      {med.quantity} unit{med.quantity === 1 ? '' : 's'} left
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Frequency</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{med.repeatSchedule}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Meal Timing</span>
                    <span className="font-semibold text-indigo-500">{med.beforeAfterFood}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-medium">
                  <Clock size={12} />
                  <span>Doses: {med.reminderTime}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
                <button 
                  onClick={() => setSelectedMed(med)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 text-[11px] font-bold text-blue-500 hover:text-blue-600 transition"
                >
                  <Eye size={12} /> <span>Dossier</span>
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(med)}
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => onDelete(med.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
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

      {/* Medicine Details Modal Dossier */}
      {selectedMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" id="med-dossier-modal">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <Pill size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">{selectedMed.name} Dossier</h3>
                  <p className="text-[10px] text-slate-400">ID Reference: {selectedMed.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMed(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              {/* Base64 Medicine Image Panel */}
              {selectedMed.image ? (
                <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center relative">
                  <img src={selectedMed.image} alt={selectedMed.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded">Prescription Photo</div>
                </div>
              ) : (
                <div className="w-full h-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                  <Pill size={24} className="stroke-1 text-slate-300 mb-1" />
                  <p className="text-[10px]">No medical asset photo registered.</p>
                </div>
              )}

              {/* Prescription Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Dosage Details</span>
                  <p className="font-bold text-slate-700 dark:text-slate-200">{selectedMed.dosage}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedMed.strength}</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Meal Relationship</span>
                  <p className="font-bold text-indigo-500">{selectedMed.beforeAfterFood}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Quantity remaining: {selectedMed.quantity}</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Prescribing Doctor</span>
                  <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <User size={12} className="text-slate-400" /> {selectedMed.doctorName || "Unspecified"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Building2 size={10} className="text-slate-400" /> {selectedMed.hospitalName || "Unspecified clinic"}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Calendar Schedule</span>
                  <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <Calendar size={12} className="text-slate-400" /> {selectedMed.repeatSchedule}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Ends {selectedMed.endDate}</p>
                </div>
              </div>

              {/* Time logs panel */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Daily Intakes Timeline</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedMed.reminderTime.split(',').map((t, idx) => (
                    <span key={idx} className="bg-blue-50 dark:bg-blue-950/20 border border-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg font-mono font-bold text-[10px]">
                      🕒 {t.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Patient Notes */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <FileText size={10} /> Clinical Notes / Instructions
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  {selectedMed.notes ? `"${selectedMed.notes}"` : "No special instructions recorded."}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex justify-between gap-3">
              <button 
                onClick={() => {
                  onDelete(selectedMed.id);
                  setSelectedMed(null);
                }}
                className="px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg flex items-center gap-1 border border-transparent hover:border-rose-500/10 transition font-bold"
              >
                <Trash2 size={12} /> Delete Medicine
              </button>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedMed(null)}
                  className="px-3.5 py-1.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 transition"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    onEdit(selectedMed);
                    setSelectedMed(null);
                  }}
                  className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-1 font-bold"
                >
                  <Edit size={12} /> Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
