import fs from 'fs/promises';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

export interface Medicine {
  id: string; // Auto-generated e.g., "MED-101"
  name: string;
  type: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drops';
  dosage: string;
  strength: string;
  quantity: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reminderTime: string; // "08:00" or comma-separated "08:00, 20:00"
  repeatSchedule: 'Daily' | 'Weekly' | 'Monthly';
  beforeAfterFood: 'Before Food' | 'After Food' | 'With Food';
  doctorName: string;
  hospitalName: string;
  image?: string; // Base64 data URL
  notes?: string;
  createdAt: string;
}

export interface ReminderHistoryEntry {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineType: string;
  dosage: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'Taken' | 'Skipped' | 'Missed';
  notes?: string;
  takenAt?: string; // Timestamp
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

export interface DatabaseSchema {
  medicines: Medicine[];
  history: ReminderHistoryEntry[];
  settings: AppSettings;
}

const DEFAULT_SETTINGS: AppSettings = {
  userName: "John Doe",
  clinicName: "Metro General Hospital",
  reminderSound: true,
  notificationsEnabled: true,
  theme: "Blue Medical",
  darkMode: false,
  reportFooter: "This is a computer-generated medication report from Smart Medicine Reminder System."
};

// Seed Data
const SEED_MEDICINES: Medicine[] = [
  {
    id: "MED-101",
    name: "Amoxicillin",
    type: "Capsule",
    dosage: "1 Capsule",
    strength: "500mg",
    quantity: 12,
    startDate: "2026-07-01",
    endDate: "2026-07-10",
    reminderTime: "08:00, 14:00, 20:00",
    repeatSchedule: "Daily",
    beforeAfterFood: "After Food",
    doctorName: "Dr. Sarah Jenkins",
    hospitalName: "Metro General Hospital",
    notes: "Take with a full glass of water. Finish entire course.",
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "MED-102",
    name: "Atorvastatin",
    type: "Tablet",
    dosage: "1 Tablet",
    strength: "20mg",
    quantity: 25,
    startDate: "2026-06-15",
    endDate: "2026-09-15",
    reminderTime: "21:00",
    repeatSchedule: "Daily",
    beforeAfterFood: "Before Food",
    doctorName: "Dr. Robert Chen",
    hospitalName: "Cardiovascular Clinic",
    notes: "Take at bedtime.",
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "MED-103",
    name: "Robitussin",
    type: "Syrup",
    dosage: "10ml",
    strength: "100mg/5ml",
    quantity: 150,
    startDate: "2026-07-04",
    endDate: "2026-07-09",
    reminderTime: "09:00, 18:00",
    repeatSchedule: "Daily",
    beforeAfterFood: "After Food",
    doctorName: "Dr. Emily Watson",
    hospitalName: "Community Health Center",
    notes: "For dry cough.",
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "MED-104",
    name: "Latanoprost",
    type: "Drops",
    dosage: "1 Drop",
    strength: "0.005%",
    quantity: 5,
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    reminderTime: "22:00",
    repeatSchedule: "Daily",
    beforeAfterFood: "Before Food",
    doctorName: "Dr. James Lee",
    hospitalName: "Eye Care Specialists",
    notes: "Put one drop in each eye.",
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  }
];

function generateSeedHistory(): ReminderHistoryEntry[] {
  const history: ReminderHistoryEntry[] = [];
  const todayStr = "2026-07-07";
  const yesterdayStr = "2026-07-06";
  const dayBeforeStr = "2026-07-05";

  // Seeding history for MED-101 (Amoxicillin: 08:00, 14:00, 20:00)
  // Day Before Yesterday (2026-07-05)
  history.push({
    id: "HIST-001",
    medicineId: "MED-101",
    medicineName: "Amoxicillin",
    medicineType: "Capsule",
    dosage: "1 Capsule",
    date: dayBeforeStr,
    time: "08:00",
    status: "Taken",
    takenAt: `${dayBeforeStr}T08:05:12Z`
  });
  history.push({
    id: "HIST-002",
    medicineId: "MED-101",
    medicineName: "Amoxicillin",
    medicineType: "Capsule",
    dosage: "1 Capsule",
    date: dayBeforeStr,
    time: "14:00",
    status: "Taken",
    takenAt: `${dayBeforeStr}T14:15:33Z`
  });
  history.push({
    id: "HIST-003",
    medicineId: "MED-101",
    medicineName: "Amoxicillin",
    medicineType: "Capsule",
    dosage: "1 Capsule",
    date: dayBeforeStr,
    time: "20:00",
    status: "Missed",
    notes: "Forgot to bring medication to dinner."
  });

  // Yesterday (2026-07-06)
  history.push({
    id: "HIST-004",
    medicineId: "MED-101",
    medicineName: "Amoxicillin",
    medicineType: "Capsule",
    dosage: "1 Capsule",
    date: yesterdayStr,
    time: "08:00",
    status: "Taken",
    takenAt: `${yesterdayStr}T08:02:44Z`
  });
  history.push({
    id: "HIST-005",
    medicineId: "MED-101",
    medicineName: "Amoxicillin",
    medicineType: "Capsule",
    dosage: "1 Capsule",
    date: yesterdayStr,
    time: "14:00",
    status: "Taken",
    takenAt: `${yesterdayStr}T14:00:10Z`
  });
  history.push({
    id: "HIST-006",
    medicineId: "MED-101",
    medicineName: "Amoxicillin",
    medicineType: "Capsule",
    dosage: "1 Capsule",
    date: yesterdayStr,
    time: "20:00",
    status: "Taken",
    takenAt: `${yesterdayStr}T20:10:00Z`
  });

  // Today Morning (2026-07-07)
  history.push({
    id: "HIST-007",
    medicineId: "MED-101",
    medicineName: "Amoxicillin",
    medicineType: "Capsule",
    dosage: "1 Capsule",
    date: todayStr,
    time: "08:00",
    status: "Taken",
    takenAt: `${todayStr}T08:05:00Z`
  });

  // Seeding history for MED-102 (Atorvastatin: 21:00)
  history.push({
    id: "HIST-008",
    medicineId: "MED-102",
    medicineName: "Atorvastatin",
    medicineType: "Tablet",
    dosage: "1 Tablet",
    date: dayBeforeStr,
    time: "21:00",
    status: "Taken",
    takenAt: `${dayBeforeStr}T21:02:00Z`
  });
  history.push({
    id: "HIST-009",
    medicineId: "MED-102",
    medicineName: "Atorvastatin",
    medicineType: "Tablet",
    dosage: "1 Tablet",
    date: yesterdayStr,
    time: "21:00",
    status: "Taken",
    takenAt: `${yesterdayStr}T21:05:00Z`
  });

  // Seeding history for MED-103 (Robitussin: 09:00, 18:00)
  history.push({
    id: "HIST-010",
    medicineId: "MED-103",
    medicineName: "Robitussin",
    medicineType: "Syrup",
    dosage: "10ml",
    date: yesterdayStr,
    time: "09:00",
    status: "Skipped",
    notes: "Feeling much better, cough subsided."
  });
  history.push({
    id: "HIST-011",
    medicineId: "MED-103",
    medicineName: "Robitussin",
    medicineType: "Syrup",
    dosage: "10ml",
    date: yesterdayStr,
    time: "18:00",
    status: "Taken",
    takenAt: `${yesterdayStr}T18:30:00Z`
  });

  return history;
}

export class JSONDatabase {
  static async init(): Promise<void> {
    try {
      await fs.mkdir(DB_DIR, { recursive: true });
      try {
        await fs.access(DB_FILE);
      } catch {
        // File does not exist, create it with seed data
        const initialData: DatabaseSchema = {
          medicines: SEED_MEDICINES,
          history: generateSeedHistory(),
          settings: DEFAULT_SETTINGS
        };
        await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
        console.log('Database seeded successfully.');
      }
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  }

  static async read(): Promise<DatabaseSchema> {
    await this.init();
    try {
      const content = await fs.readFile(DB_FILE, 'utf-8');
      return JSON.parse(content) as DatabaseSchema;
    } catch (err) {
      console.error('Error reading database:', err);
      return { medicines: [], history: [], settings: DEFAULT_SETTINGS };
    }
  }

  static async write(data: DatabaseSchema): Promise<void> {
    await fs.mkdir(DB_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Medicines CRUD
  static async getMedicines(): Promise<Medicine[]> {
    const db = await this.read();
    return db.medicines;
  }

  static async addMedicine(medicine: Omit<Medicine, 'id' | 'createdAt'>): Promise<Medicine> {
    const db = await this.read();
    
    // Auto generate ID (e.g., MED-105)
    let nextNum = 101;
    if (db.medicines.length > 0) {
      const ids = db.medicines.map(m => {
        const match = m.id.match(/MED-(\d+)/);
        return match ? parseInt(match[1], 10) : 100;
      });
      nextNum = Math.max(...ids) + 1;
    }
    const id = `MED-${nextNum}`;

    const newMed: Medicine = {
      ...medicine,
      id,
      createdAt: new Date().toISOString()
    };

    db.medicines.push(newMed);
    await this.write(db);
    return newMed;
  }

  static async updateMedicine(id: string, updates: Partial<Omit<Medicine, 'id' | 'createdAt'>>): Promise<Medicine | null> {
    const db = await this.read();
    const idx = db.medicines.findIndex(m => m.id === id);
    if (idx === -1) return null;

    db.medicines[idx] = {
      ...db.medicines[idx],
      ...updates
    };

    await this.write(db);
    return db.medicines[idx];
  }

  static async deleteMedicine(id: string): Promise<boolean> {
    const db = await this.read();
    const lenBefore = db.medicines.length;
    db.medicines = db.medicines.filter(m => m.id !== id);
    
    // Also cleanup history for this medicine to keep DB clean (or keep it as orphan, but let's keep it to preserve statistics)
    // Actually, keep history so analytics don't break, but mark them or filter by exists if needed.
    
    if (db.medicines.length === lenBefore) return false;
    await this.write(db);
    return true;
  }

  // History CRUD
  static async getHistory(): Promise<ReminderHistoryEntry[]> {
    const db = await this.read();
    return db.history;
  }

  static async logReminderAction(entry: Omit<ReminderHistoryEntry, 'id'>): Promise<ReminderHistoryEntry> {
    const db = await this.read();
    
    // Find if duplicate entry exists for this medicine, date, time and update it, otherwise create new.
    const existingIdx = db.history.findIndex(h => 
      h.medicineId === entry.medicineId && 
      h.date === entry.date && 
      h.time === entry.time
    );

    let finalEntry: ReminderHistoryEntry;
    if (existingIdx !== -1) {
      finalEntry = {
        ...db.history[existingIdx],
        ...entry,
        takenAt: entry.status === 'Taken' ? new Date().toISOString() : undefined
      };
      db.history[existingIdx] = finalEntry;
    } else {
      let nextNum = 1;
      if (db.history.length > 0) {
        const ids = db.history.map(h => {
          const match = h.id.match(/HIST-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        });
        nextNum = Math.max(...ids) + 1;
      }
      const padNum = String(nextNum).padStart(3, '0');
      const id = `HIST-${padNum}`;

      finalEntry = {
        ...entry,
        id,
        takenAt: entry.status === 'Taken' ? new Date().toISOString() : undefined
      };
      db.history.push(finalEntry);
    }

    // Adjust quantities of medicines if marked as Taken
    if (entry.status === 'Taken' && existingIdx === -1) {
      // Find medicine and decrease quantity
      const medIdx = db.medicines.findIndex(m => m.id === entry.medicineId);
      if (medIdx !== -1) {
        // Decrease stock by 1
        db.medicines[medIdx].quantity = Math.max(0, db.medicines[medIdx].quantity - 1);
      }
    }

    await this.write(db);
    return finalEntry;
  }

  // Settings
  static async getSettings(): Promise<AppSettings> {
    const db = await this.read();
    return db.settings || DEFAULT_SETTINGS;
  }

  static async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    const db = await this.read();
    db.settings = {
      ...db.settings,
      ...updates
    };
    await this.write(db);
    return db.settings;
  }

  // Backup & Restore
  static async exportDB(): Promise<string> {
    const db = await this.read();
    return JSON.stringify(db, null, 2);
  }

  static async importDB(jsonStr: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonStr) as DatabaseSchema;
      if (Array.isArray(parsed.medicines) && Array.isArray(parsed.history) && parsed.settings) {
        await this.write(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
