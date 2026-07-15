export interface Medicine {
  id: string;
  name: string;
  type: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drops';
  dosage: string;
  strength: string;
  quantity: number;
  startDate: string;
  endDate: string;
  reminderTime: string; // Comma separated or single time
  repeatSchedule: 'Daily' | 'Weekly' | 'Monthly';
  beforeAfterFood: 'Before Food' | 'After Food' | 'With Food';
  doctorName: string;
  hospitalName: string;
  image?: string;
  notes?: string;
  createdAt: string;
}

export interface Reminder {
  medicineId: string;
  medicineName: string;
  medicineType: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drops';
  dosage: string;
  strength: string;
  beforeAfterFood: 'Before Food' | 'After Food' | 'With Food';
  quantity: number;
  notes?: string;
  time: string;
  date: string;
  status: 'Taken' | 'Skipped' | 'Missed' | 'Pending';
  historyEntryId?: string;
  doctorName: string;
  hospitalName: string;
  image?: string;
}

export interface ReminderHistoryEntry {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineType: string;
  dosage: string;
  date: string;
  time: string;
  status: 'Taken' | 'Skipped' | 'Missed';
  notes?: string;
  takenAt?: string;
}

export interface AppSettings {
  userName: string;
  clinicName: string;
  reminderSound: boolean;
  notificationsEnabled: boolean;
  theme: string;
  darkMode: boolean;
  reportFooter: string;
}

export interface DashboardData {
  date: string;
  time: string;
  totalMedicines: number;
  todayMedicines: number;
  upcomingRemindersCount: number;
  missedToday: number;
  completedToday: number;
  skippedToday: number;
  pendingToday: number;
  adherencePercentage: number;
  todayAdherencePercentage: number;
  todaySchedule: Reminder[];
  upcomingReminders: Reminder[];
  weeklyChart: {
    date: string;
    dayName: string;
    Taken: number;
    Missed: number;
    Skipped: number;
    Pending: number;
  }[];
  categoryDistribution: {
    Tablet: number;
    Capsule: number;
    Syrup: number;
    Injection: number;
    Drops: number;
  };
  recommendations: string[];
  historySummary: ReminderHistoryEntry[];
}
