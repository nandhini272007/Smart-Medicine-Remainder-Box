import React from 'react';
import { 
  Pill, 
  Upload, 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Building, 
  AlertTriangle, 
  Sparkles, 
  PlusCircle, 
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Medicine } from '../types.js';

interface AddReminderViewProps {
  editingMedicine: Medicine | null;
  onCancelEdit: () => void;
  onSubmit: (data: Omit<Medicine, 'id' | 'createdAt'>) => void;
}

export default function AddReminderView({ editingMedicine, onCancelEdit, onSubmit }: AddReminderViewProps) {
  const isEditMode = !!editingMedicine;
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<Omit<Medicine, 'id' | 'createdAt'>>({
    defaultValues: {
      name: '',
      type: 'Tablet',
      dosage: '1 Tablet',
      strength: '500mg',
      quantity: 30,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
      reminderTime: '08:00',
      repeatSchedule: 'Daily',
      beforeAfterFood: 'After Food',
      doctorName: '',
      hospitalName: '',
      notes: ''
    }
  });

  // Pre-populate if editing
  React.useEffect(() => {
    if (editingMedicine) {
      reset({
        name: editingMedicine.name,
        type: editingMedicine.type,
        dosage: editingMedicine.dosage,
        strength: editingMedicine.strength,
        quantity: editingMedicine.quantity,
        startDate: editingMedicine.startDate,
        endDate: editingMedicine.endDate,
        reminderTime: editingMedicine.reminderTime,
        repeatSchedule: editingMedicine.repeatSchedule,
        beforeAfterFood: editingMedicine.beforeAfterFood,
        doctorName: editingMedicine.doctorName || '',
        hospitalName: editingMedicine.hospitalName || '',
        notes: editingMedicine.notes || ''
      });
      setImagePreview(editingMedicine.image || null);
    } else {
      reset({
        name: '',
        type: 'Tablet',
        dosage: '1 Tablet',
        strength: '500mg',
        quantity: 30,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
        reminderTime: '08:00',
        repeatSchedule: 'Daily',
        beforeAfterFood: 'After Food',
        doctorName: '',
        hospitalName: '',
        notes: ''
      });
      setImagePreview(null);
    }
  }, [editingMedicine, reset]);

  // Handle Image upload and Base64 conversion
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (png/jpeg/webp)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImagePreview(base64);
      setValue('image', base64);
    };
    reader.readAsDataURL(file);
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
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleManualFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const triggerFormSubmit = (data: Omit<Medicine, 'id' | 'createdAt'>) => {
    // Inject image base64 if it exists
    if (imagePreview) {
      data.image = imagePreview;
    }
    onSubmit(data);
    if (!isEditMode) {
      reset();
      setImagePreview(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" id="add-reminder-view">
      {/* View Header */}
      <div className="flex items-center space-x-3.5 pb-2">
        {isEditMode && (
          <button 
            onClick={onCancelEdit}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-500 dark:text-slate-400"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <PlusCircle size={22} className="text-blue-500" />
            {isEditMode ? "Modify Prescription Dossier" : "Schedule New Medicine Reminder"}
          </h2>
          <p className="text-xs text-slate-400">Configure medical dosing schedules, treatment calendars, and prescription assets.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(triggerFormSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Columns: Form Fields */}
        <div className="md:col-span-2 space-y-5 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Medicine Name*</label>
              <input 
                type="text" 
                placeholder="e.g. Paracetamol, Lisinopril"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
              {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Medicine Type / Form*</label>
              <select 
                {...register('type')}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="Tablet">Tablet 💊</option>
                <option value="Capsule">Capsule 💊</option>
                <option value="Syrup">Syrup 🧪</option>
                <option value="Drops">Drops 💧</option>
                <option value="Injection">Injection 💉</option>
              </select>
            </div>

            {/* Dosage */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Dosage Instructions*</label>
              <input 
                type="text" 
                placeholder="e.g. 1 Tablet, 5ml, 2 Drops"
                {...register('dosage', { required: 'Dosage is required' })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
              {errors.dosage && <p className="text-[10px] text-rose-500 mt-1">{errors.dosage.message}</p>}
            </div>

            {/* Strength */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Strength*</label>
              <input 
                type="text" 
                placeholder="e.g. 500mg, 10mg/ml"
                {...register('strength', { required: 'Strength is required' })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
              {errors.strength && <p className="text-[10px] text-rose-500 mt-1">{errors.strength.message}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Initial Supply Qty*</label>
              <input 
                type="number" 
                placeholder="Total number of units"
                {...register('quantity', { required: 'Quantity is required', min: 1 })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
              {errors.quantity && <p className="text-[10px] text-rose-500 mt-1">{errors.quantity.message}</p>}
            </div>

            {/* Reminder Times */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Reminder Times (HH:MM)*</label>
              <input 
                type="text" 
                placeholder="e.g. 08:00, 14:00, 20:00 (comma-separated)"
                {...register('reminderTime', { 
                  required: 'At least one time is required',
                  pattern: {
                    value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](\s*,\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9])*$/,
                    message: 'Format must be comma-separated 24h clock times, e.g., 08:00, 14:00'
                  }
                })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
              {errors.reminderTime && <p className="text-[10px] text-rose-500 mt-1">{errors.reminderTime.message}</p>}
            </div>

            {/* Calendar Start Date */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Start Date*</label>
              <div className="relative">
                <input 
                  type="date" 
                  {...register('startDate', { required: 'Start date is required' })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              {errors.startDate && <p className="text-[10px] text-rose-500 mt-1">{errors.startDate.message}</p>}
            </div>

            {/* Calendar End Date */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">End Date*</label>
              <input 
                type="date" 
                {...register('endDate', { required: 'End date is required' })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
              {errors.endDate && <p className="text-[10px] text-rose-500 mt-1">{errors.endDate.message}</p>}
            </div>

            {/* Repeat Schedule */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Repeat Schedule</label>
              <select 
                {...register('repeatSchedule')}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="Daily">Daily 🔁</option>
                <option value="Weekly">Weekly 📅</option>
                <option value="Monthly">Monthly 🗓️</option>
              </select>
            </div>

            {/* Meal Relationship */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Food Instructions</label>
              <select 
                {...register('beforeAfterFood')}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="After Food">After Food 🍽️</option>
                <option value="Before Food">Before Food 🥛</option>
                <option value="With Food">With Food 🥣</option>
              </select>
            </div>

            {/* Doctor Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Prescribing Doctor</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Dr. Name"
                  {...register('doctorName')}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Hospital Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Hospital / Clinic Source</label>
              <input 
                type="text" 
                placeholder="e.g. Community Clinic"
                {...register('hospitalName')}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Special Instructions Notes */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Clinical Instructions / Patient Notes</label>
            <textarea 
              rows={3}
              placeholder="e.g. Do not consume alcohol during this cycle. Take with water."
              {...register('notes')}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-100 dark:border-slate-600 focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>
        </div>

        {/* Right 1 Column: File Image Upload Panel */}
        <div className="space-y-5 flex flex-col">
          {/* Draggable/Clickable Image Uploader Panel */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex-grow flex flex-col justify-between">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Medicine Package Image</label>
              
              {/* Drag Area */}
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[200px] ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' 
                    : imagePreview 
                      ? 'border-emerald-500/35 bg-emerald-50/5 dark:bg-emerald-950/5' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                id="image-drag-area"
              >
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleManualFile}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />

                {imagePreview ? (
                  <div className="space-y-4 w-full">
                    <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center relative">
                      <img src={imagePreview} alt="Package asset preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 transition z-20"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-500">Asset Loaded Successfully</p>
                  </div>
                ) : (
                  <div className="space-y-2 pointer-events-none">
                    <div className="mx-auto w-10 h-10 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/10">
                      <Upload size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Drag and drop package photo</p>
                      <p className="text-[10px] text-slate-400">or click to browse local files</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Smart info tip box */}
            <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-500/10 flex gap-2 text-[10px] text-slate-500 leading-relaxed">
              <Sparkles size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-600 dark:text-blue-400">Self-Contained Database</p>
                <p className="mt-0.5 dark:text-slate-400">Images are compiled into data URLs directly inside your database backups. Your configurations will restore seamlessly anywhere.</p>
              </div>
            </div>
          </div>

          {/* Form Trigger Buttons */}
          <div className="flex gap-3">
            {isEditMode && (
              <button 
                type="button" 
                onClick={onCancelEdit}
                className="w-1/3 py-3 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition font-bold"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit"
              id="med-form-submit-btn"
              className={`py-3 text-xs text-white rounded-xl shadow-md font-extrabold hover:bg-blue-700 transition ${isEditMode ? 'w-2/3 bg-indigo-600 hover:bg-indigo-700' : 'w-full bg-blue-600 hover:bg-blue-700'}`}
            >
              {isEditMode ? "Update Medication Dossier" : "Assemble Dosing Schedule"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
