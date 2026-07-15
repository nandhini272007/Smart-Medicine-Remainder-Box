import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import DashboardView from './components/DashboardView.js';
import MedicinesView from './components/MedicinesView.js';
import AddReminderView from './components/AddReminderView.js';
import TodayScheduleView from './components/TodayScheduleView.js';
import HistoryView from './components/HistoryView.js';
import ReportsView from './components/ReportsView.js';
import AnalyticsView from './components/AnalyticsView.js';
import SettingsView from './components/SettingsView.js';
import AboutView from './components/AboutView.js';

import * as api from './api.js';
import { Medicine, Reminder, ReminderHistoryEntry, AppSettings, DashboardData } from './types.js';

export default function App() {
  // Navigation tabs State
  const [activeTab, setActiveTab] = React.useState('dashboard');

  // Core Data Cache States
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
  const [medicines, setMedicines] = React.useState<Medicine[]>([]);
  const [history, setHistory] = React.useState<ReminderHistoryEntry[]>([]);
  const [settings, setSettings] = React.useState<AppSettings | null>(null);

  // Pagination & Filters State
  const [medCurrentPage, setMedCurrentPage] = React.useState(1);
  const [medTotalPages, setMedTotalPages] = React.useState(1);
  const [medSearch, setMedSearch] = React.useState('');
  const [medFilters, setMedFilters] = React.useState<{ type?: string; repeatSchedule?: string; beforeAfterFood?: string }>({});

  const [histCurrentPage, setHistCurrentPage] = React.useState(1);
  const [histTotalPages, setHistTotalPages] = React.useState(1);
  const [histSearch, setHistSearch] = React.useState('');
  const [histStatusFilter, setHistStatusFilter] = React.useState('');

  // Editing state
  const [editingMedicine, setEditingMedicine] = React.useState<Medicine | null>(null);

  // Global search transition helpers
  const [selectedMedFromGlobalSearch, setSelectedMedFromGlobalSearch] = React.useState<Medicine | null>(null);

  // UI Load state
  const [loadingDashboard, setLoadingDashboard] = React.useState(true);
  const [loadingMedicines, setLoadingMedicines] = React.useState(true);
  const [loadingHistory, setLoadingHistory] = React.useState(true);

  // In-app custom toast alerts state
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Read URL Hash on first load to restore user context
  React.useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['dashboard', 'medicines', 'add-reminder', 'today-schedule', 'history', 'reports', 'analytics', 'settings', 'about'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Sync state data on load
  const loadInitialSettings = async () => {
    try {
      const sett = await api.getSettings();
      setSettings(sett);
      if (sett.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      showToast('Could not load settings from server.', 'error');
    }
  };

  const loadDashboard = async () => {
    setLoadingDashboard(true);
    try {
      const data = await api.getDashboard();
      setDashboardData(data);
    } catch {
      showToast('Error polling real-time dashboard analytics.', 'error');
    } finally {
      setLoadingDashboard(false);
    }
  };

  const loadMedicines = async () => {
    setLoadingMedicines(true);
    try {
      const res = await api.getMedicines({
        page: medCurrentPage,
        limit: 9,
        q: medSearch || undefined,
        ...medFilters
      });
      setMedicines(res.medicines);
      setMedTotalPages(res.pagination.totalPages);
    } catch {
      showToast('Could not retrieve prescription registry.', 'error');
    } finally {
      setLoadingMedicines(false);
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.getHistory({
        page: histCurrentPage,
        limit: 15,
        q: histSearch || undefined,
        status: histStatusFilter || undefined
      });
      setHistory(res.history);
      setHistTotalPages(res.pagination.totalPages);
    } catch {
      showToast('Error indexing compliance log timeline.', 'error');
    } finally {
      setLoadingHistory(false);
    }
  };

  React.useEffect(() => {
    loadInitialSettings();
  }, []);

  React.useEffect(() => {
    loadDashboard();
  }, [activeTab]);

  React.useEffect(() => {
    loadMedicines();
  }, [medCurrentPage, medSearch, medFilters, activeTab]);

  React.useEffect(() => {
    loadHistory();
  }, [histCurrentPage, histSearch, histStatusFilter, activeTab]);

  // Combined full refresh
  const handleFullRefresh = () => {
    loadDashboard();
    loadMedicines();
    loadHistory();
    loadInitialSettings();
  };

  // Toast Notifier Trigger
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Synthesize custom audio double-beep chime using Web Audio API
  const playSynthesizedChime = () => {
    if (settings && !settings.reminderSound) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      // Dual tone happy notification chime
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.start();
      
      setTimeout(() => {
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      }, 110);
      
      setTimeout(() => {
        osc.stop();
      }, 240);
    } catch {
      // Audio blocked or unsupported
    }
  };

  // Address Reminder Action (Taken / Skipped / Missed)
  const handleReminderAction = async (reminder: Reminder, action: 'Taken' | 'Skipped' | 'Missed', notes?: string) => {
    try {
      await api.logReminderAction({
        medicineId: reminder.medicineId,
        medicineName: reminder.medicineName,
        medicineType: reminder.medicineType,
        dosage: reminder.dosage,
        date: reminder.date,
        time: reminder.time,
        status: action,
        notes: notes || undefined
      });

      if (action === 'Taken') {
        playSynthesizedChime();
        showToast(`Logged successfully. Dosed ${reminder.medicineName}!`, 'success');
      } else if (action === 'Skipped') {
        showToast(`Regimen skipped: ${reminder.medicineName}`, 'success');
      } else {
        showToast(`Documented missed dose: ${reminder.medicineName}`, 'error');
      }

      // Refresh data to keep adherence counts accurate
      handleFullRefresh();
    } catch {
      showToast('Error recording compliance action on server.', 'error');
    }
  };

  // Create or Update Medicine Submit
  const handleMedicineFormSubmit = async (data: Omit<Medicine, 'id' | 'createdAt'>) => {
    try {
      if (editingMedicine) {
        // Edit flow
        await api.updateMedicine(editingMedicine.id, data);
        showToast(`Prescription dossier updated: ${data.name}`, 'success');
        setEditingMedicine(null);
      } else {
        // Create flow
        await api.addMedicine(data);
        showToast(`Dosing schedule compiled: ${data.name}`, 'success');
      }
      handleFullRefresh();
      setActiveTab('medicines');
      window.location.hash = 'medicines';
    } catch {
      showToast('Error saving medication schedule.', 'error');
    }
  };

  // Start Editing Medicine Redirect
  const handleStartEditMedicine = (med: Medicine) => {
    setEditingMedicine(med);
    setActiveTab('add-reminder');
    window.location.hash = 'add-reminder';
  };

  // Delete Medicine
  const handleDeleteMedicine = async (id: string) => {
    if (confirm('Are you sure you want to delete this prescribed medicine and permanently wipe its schedule?')) {
      try {
        await api.deleteMedicine(id);
        showToast('Prescribed medication removed from registry.', 'success');
        handleFullRefresh();
      } catch {
        showToast('Error removing medication from registry.', 'error');
      }
    }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-100 transition duration-200">
      {/* 1. Left Mobile Responsive Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        clinicName={settings?.clinicName || "Metro General Clinic"} 
      />

      {/* Main Container Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* 2. Top Header dashboard utilities */}
        <Header 
          userName={settings?.userName || "Caregiver/Patient"}
          clinicName={settings?.clinicName || "Patient Mode"}
          onNavigateToTab={(tab) => {
            setActiveTab(tab);
            window.location.hash = tab;
          }}
          onSelectMedicine={(med) => {
            setSelectedMedFromGlobalSearch(med);
          }}
        />

        {/* 3. Render View Panel Content based on Active Tab */}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView 
                  data={dashboardData}
                  loading={loadingDashboard}
                  onNavigateToTab={(tab) => {
                    setActiveTab(tab);
                    window.location.hash = tab;
                  }}
                  onSelectReminder={(rem) => {}}
                  onAction={handleReminderAction}
                />
              )}

              {activeTab === 'medicines' && (
                <MedicinesView 
                  medicines={medicines}
                  totalMedicines={dashboardData?.totalMedicines || 0}
                  totalPages={medTotalPages}
                  currentPage={medCurrentPage}
                  onPageChange={setMedCurrentPage}
                  onSearchChange={setMedSearch}
                  onFilterChange={setMedFilters}
                  onEdit={handleStartEditMedicine}
                  onDelete={handleDeleteMedicine}
                  onNavigateToTab={(tab) => {
                    setActiveTab(tab);
                    window.location.hash = tab;
                  }}
                  selectedMedFromGlobalSearch={selectedMedFromGlobalSearch}
                  clearSelectedMedFromGlobalSearch={() => setSelectedMedFromGlobalSearch(null)}
                />
              )}

              {activeTab === 'add-reminder' && (
                <AddReminderView 
                  editingMedicine={editingMedicine}
                  onCancelEdit={() => {
                    setEditingMedicine(null);
                    setActiveTab('medicines');
                    window.location.hash = 'medicines';
                  }}
                  onSubmit={handleMedicineFormSubmit}
                />
              )}

              {activeTab === 'today-schedule' && (
                <TodayScheduleView 
                  schedule={dashboardData?.todaySchedule || []}
                  loading={loadingDashboard}
                  onAction={handleReminderAction}
                  completedCount={dashboardData?.completedToday || 0}
                  missedCount={dashboardData?.missedToday || 0}
                  skippedCount={dashboardData?.skippedToday || 0}
                  pendingCount={dashboardData?.pendingToday || 0}
                  adherencePercentage={dashboardData?.todayAdherencePercentage || 100}
                />
              )}

              {activeTab === 'history' && (
                <HistoryView 
                  history={history}
                  totalPages={histTotalPages}
                  currentPage={histCurrentPage}
                  onPageChange={setHistCurrentPage}
                  onSearchChange={setHistSearch}
                  onStatusFilterChange={setHistStatusFilter}
                  loading={loadingHistory}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView 
                  userName={settings?.userName || "John Doe"}
                  clinicName={settings?.clinicName || "Metro General Hospital"}
                  medicines={medicines}
                  history={history}
                  adherencePercentage={dashboardData?.adherencePercentage || 100}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView 
                  data={dashboardData}
                  loading={loadingDashboard}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView 
                  settings={settings}
                  onUpdateSettings={setSettings}
                  onShowToast={showToast}
                  onRefreshData={handleFullRefresh}
                />
              )}

              {activeTab === 'about' && (
                <AboutView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Glassmorphic Toast Alerts */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4.5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-xs font-bold font-sans ${
              toast.type === 'success' 
                ? 'bg-emerald-500/90 text-white border-emerald-500/10' 
                : 'bg-rose-500/90 text-white border-rose-500/10'
            }`}
            id="toast-notifier"
          >
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
