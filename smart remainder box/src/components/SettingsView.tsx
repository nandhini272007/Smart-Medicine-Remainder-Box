import React from 'react';
import { 
  Settings, 
  User, 
  Volume2, 
  VolumeX, 
  Bell, 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Sliders, 
  Trash2, 
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AppSettings } from '../types.js';
import * as api from '../api.js';

interface SettingsViewProps {
  settings: AppSettings | null;
  onUpdateSettings: (settings: AppSettings) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
  onRefreshData: () => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  onShowToast,
  onRefreshData
}: SettingsViewProps) {
  const [isRestoring, setIsRestoring] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const { register, handleSubmit, reset } = useForm<AppSettings>({
    defaultValues: {
      userName: '',
      clinicName: '',
      reminderSound: true,
      notificationsEnabled: true,
      theme: 'Blue Medical',
      darkMode: false,
      reportFooter: ''
    }
  });

  React.useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSaveSettings = async (data: AppSettings) => {
    try {
      const updated = await api.updateSettings(data);
      onUpdateSettings(updated);
      onShowToast('System settings updated successfully!', 'success');
      
      // Update HTML theme classes for dark mode
      if (data.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (err) {
      onShowToast('Failed to update system settings.', 'error');
    }
  };

  const handleBackup = async () => {
    try {
      const dbContent = await api.exportDatabase();
      const blob = new Blob([JSON.stringify(dbContent, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `smart-med-reminder-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onShowToast('Database exported successfully as JSON file!', 'success');
    } catch (err) {
      onShowToast('Database export failed.', 'error');
    }
  };

  const handleRestoreFile = async (file: File) => {
    setIsRestoring(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const res = await api.restoreDatabase(text);
        if (res.success) {
          onShowToast('Database restored successfully!', 'success');
          onRefreshData();
        } else {
          onShowToast('Invalid backup file schema.', 'error');
        }
      } catch {
        onShowToast('Error reading backup file.', 'error');
      } finally {
        setIsRestoring(false);
      }
    };
    reader.readAsText(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleRestoreFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleRestoreFile(e.target.files[0]);
    }
  };

  const handleResetDatabase = async () => {
    if (confirm('CRITICAL ACTION: Are you sure you want to delete all custom medicine logs and reset the database to factory clinical seeds? This action cannot be reversed.')) {
      try {
        const res = await api.resetDatabase();
        if (res.success) {
          onShowToast('Database restored to factory seeds successfully!', 'success');
          onRefreshData();
        }
      } catch {
        onShowToast('Database reset failed.', 'error');
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" id="settings-view">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings size={22} className="text-blue-500 animate-spin-slow" />
          System Preferences & Maintenance
        </h2>
        <p className="text-xs text-slate-400">Configure clinic metadata, sound triggers, reporting templates, and database exports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Form Settings */}
        <form onSubmit={handleSubmit(onSaveSettings)} className="md:col-span-2 space-y-5 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100 dark:border-slate-700">Metadata Customizations</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* User Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Primary Caregiver / Patient Name</label>
              <input 
                type="text"
                {...register('userName')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Clinic Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Clinic / Hospital Network</label>
              <input 
                type="text"
                {...register('clinicName')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Theme Select */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Theme Accent</label>
              <select 
                {...register('theme')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="Blue Medical">Blue Medical 🏥</option>
                <option value="Emerald Clean">Emerald Clean 🌿</option>
                <option value="Teal Clinic">Teal Clinic 🧪</option>
              </select>
            </div>

            {/* Dark Mode */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Display Mode</label>
              <div className="flex items-center space-x-3.5 pt-1">
                <input 
                  type="checkbox"
                  id="darkModeToggle"
                  {...register('darkMode')}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="darkModeToggle" className="font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                  Activate Night / Dark Mode
                </label>
              </div>
            </div>
          </div>

          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100 dark:border-slate-700 pt-3">Audio & Notifications</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sound alerts */}
            <div className="flex items-start space-x-3.5 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 rounded-xl">
              <input 
                type="checkbox"
                id="soundToggle"
                {...register('reminderSound')}
                className="w-4 h-4 mt-0.5 rounded text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
              />
              <div>
                <label htmlFor="soundToggle" className="font-bold text-slate-700 dark:text-slate-200 cursor-pointer flex items-center gap-1">
                  Audio Alarms
                </label>
                <p className="text-[10px] text-slate-400 mt-0.5">Trigger audio reminders when medications are due.</p>
              </div>
            </div>

            {/* Notifications enabled */}
            <div className="flex items-start space-x-3.5 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 rounded-xl">
              <input 
                type="checkbox"
                id="notifToggle"
                {...register('notificationsEnabled')}
                className="w-4 h-4 mt-0.5 rounded text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
              />
              <div>
                <label htmlFor="notifToggle" className="font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                  System Banners
                </label>
                <p className="text-[10px] text-slate-400 mt-0.5">Allow the system to raise banner alerts on schedule events.</p>
              </div>
            </div>
          </div>

          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100 dark:border-slate-700 pt-3">Clinical Reporting Templates</h3>

          {/* Report Footer */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Default Report Endorsement Footer</label>
            <textarea 
              rows={3}
              {...register('reportFooter')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          <button 
            type="submit"
            id="save-settings-btn"
            className="w-full py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-md transition"
          >
            Commit Settings Customizations
          </button>
        </form>

        {/* Right Column: Database Maintenance Controls */}
        <div className="space-y-6">
          {/* Backup & Restore Board */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Database size={14} className="text-blue-500" /> Database Maintenance
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Export comprehensive clinical schemas, backup historical compliance logs, or upload existing configurations seamlessly.
            </p>

            <button 
              onClick={handleBackup}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 dark:text-blue-400 rounded-xl border border-blue-500/10 transition"
              id="export-db-btn"
            >
              <Download size={14} /> Backup & Export DB
            </button>

            {/* Restore Drag Zone */}
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer relative flex flex-col items-center justify-center min-h-[100px] transition ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50/20' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <input 
                type="file" 
                accept=".json"
                onChange={handleManualRestore}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <Upload size={16} className="text-slate-400 mb-1" />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Drop backup JSON file</span>
              <span className="text-[8px] text-slate-400">or click to upload</span>
            </div>
          </div>

          {/* Reset Factory Database Board */}
          <div className="bg-rose-50/40 dark:bg-rose-950/10 border border-rose-500/10 p-6 rounded-2xl space-y-3.5">
            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
              <Trash2 size={14} /> Clinical Factory Reset
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Resets the database, deleting all custom patient profiles and logging history. Re-initiates high-quality seed configurations immediately.
            </p>
            <button 
              onClick={handleResetDatabase}
              className="w-full py-2.5 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow transition"
              id="reset-db-btn"
            >
              Force Factory Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
