import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { JSONDatabase, Medicine, ReminderHistoryEntry, AppSettings } from './server/db.js';

// Since we are running in modern Node.js, we should handle .ts imports carefully or compile.
// We'll import db.ts (which esbuild and tsx will resolve).
import * as dbModule from './server/db.js';

const app = express();
const PORT = 3000;

// Enable JSON parsing with a high limit for Base64 image strings
app.use(express.json({ limit: '15mb' }));

// Helper: check if a date is within start and end range (inclusive)
function isDateInRange(dateStr: string, startStr: string, endStr: string): boolean {
  const target = new Date(dateStr + 'T00:00:00');
  const start = new Date(startStr + 'T00:00:00');
  const end = new Date(endStr + 'T00:00:00');
  return target >= start && target <= end;
}

// Helper: check if medicine is scheduled for a given day
function isScheduledForDate(med: Medicine, dateStr: string): boolean {
  if (!isDateInRange(dateStr, med.startDate, med.endDate)) {
    return false;
  }

  if (med.repeatSchedule === 'Daily') {
    return true;
  }

  const date = new Date(dateStr + 'T00:00:00');
  
  if (med.repeatSchedule === 'Weekly') {
    // For weekly, we can assume it repeats on the same day-of-week as the start date
    const startDay = new Date(med.startDate + 'T00:00:00').getDay();
    return date.getDay() === startDay;
  }

  if (med.repeatSchedule === 'Monthly') {
    // For monthly, repeats on the same day-of-month as the start date
    const startDom = new Date(med.startDate + 'T00:00:00').getDate();
    return date.getDate() === startDom;
  }

  return true;
}

// REST API Endpoints

// 1. Medicines API
app.get('/api/medicines', async (req, res) => {
  try {
    const { q, type, repeatSchedule, beforeAfterFood, page = '1', limit = '10' } = req.query;
    let list = await JSONDatabase.getMedicines();

    // Search query
    if (q) {
      const search = String(q).toLowerCase();
      list = list.filter(m => 
        m.name.toLowerCase().includes(search) ||
        m.doctorName.toLowerCase().includes(search) ||
        m.hospitalName.toLowerCase().includes(search) ||
        (m.notes && m.notes.toLowerCase().includes(search))
      );
    }

    // Filters
    if (type) {
      list = list.filter(m => m.type === type);
    }
    if (repeatSchedule) {
      list = list.filter(m => m.repeatSchedule === repeatSchedule);
    }
    if (beforeAfterFood) {
      list = list.filter(m => m.beforeAfterFood === beforeAfterFood);
    }

    // Sort by createdAt desc
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const pNum = parseInt(String(page), 10);
    const lNum = parseInt(String(limit), 10);
    const total = list.length;
    const paginated = list.slice((pNum - 1) * lNum, pNum * lNum);

    res.json({
      medicines: paginated,
      pagination: {
        page: pNum,
        limit: lNum,
        total,
        totalPages: Math.ceil(total / lNum)
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/medicines', async (req, res) => {
  try {
    const medData = req.body;
    // Simple validation
    if (!medData.name || !medData.type || !medData.dosage || !medData.startDate || !medData.endDate || !medData.reminderTime) {
      return res.status(400).json({ error: 'Missing required medicine fields.' });
    }
    const newMed = await JSONDatabase.addMedicine(medData);
    res.status(201).json(newMed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/medicines/:id', async (req, res) => {
  try {
    const updated = await JSONDatabase.updateMedicine(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Medicine not found.' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/medicines/:id', async (req, res) => {
  try {
    const success = await JSONDatabase.deleteMedicine(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Medicine not found.' });
    }
    res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Settings API
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await JSONDatabase.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const updated = await JSONDatabase.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Reminder History & Logging API
app.get('/api/history', async (req, res) => {
  try {
    const { q, status, page = '1', limit = '15' } = req.query;
    let list = await JSONDatabase.getHistory();

    if (q) {
      const search = String(q).toLowerCase();
      list = list.filter(h => 
        h.medicineName.toLowerCase().includes(search) ||
        h.medicineType.toLowerCase().includes(search) ||
        (h.notes && h.notes.toLowerCase().includes(search))
      );
    }

    if (status) {
      list = list.filter(h => h.status === status);
    }

    // Sort by date desc, time desc
    list.sort((a, b) => {
      const dateTimeA = `${a.date}T${a.time}`;
      const dateTimeB = `${b.date}T${b.time}`;
      return new Date(dateTimeB).getTime() - new Date(dateTimeA).getTime();
    });

    const pNum = parseInt(String(page), 10);
    const lNum = parseInt(String(limit), 10);
    const total = list.length;
    const paginated = list.slice((pNum - 1) * lNum, pNum * lNum);

    res.json({
      history: paginated,
      pagination: {
        page: pNum,
        limit: lNum,
        total,
        totalPages: Math.ceil(total / lNum)
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/history/action', async (req, res) => {
  try {
    const entry = req.body;
    if (!entry.medicineId || !entry.medicineName || !entry.date || !entry.time || !entry.status) {
      return res.status(400).json({ error: 'Missing required history logging fields.' });
    }
    const logged = await JSONDatabase.logReminderAction(entry);
    res.status(201).json(logged);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Smart Schedule & Dashboard Data API
app.get('/api/dashboard', async (req, res) => {
  try {
    // Current server date and time context
    // Target date is provided by query or defaults to local server time
    const queryDateStr = req.query.date ? String(req.query.date) : "2026-07-07"; // Hardcoded default based on prompt's current time context
    const currentHourMin = req.query.time ? String(req.query.time) : "09:30";

    const medicines = await JSONDatabase.getMedicines();
    const history = await JSONDatabase.getHistory();

    // A. Generate schedule for the specific date
    const todayReminders: any[] = [];
    
    medicines.forEach(med => {
      if (isScheduledForDate(med, queryDateStr)) {
        // Split times (e.g. "08:00, 14:00")
        const times = med.reminderTime.split(',').map(t => t.trim());
        times.forEach(t => {
          // Find if there's logged history
          const log = history.find(h => h.medicineId === med.id && h.date === queryDateStr && h.time === t);
          
          let status: 'Taken' | 'Skipped' | 'Missed' | 'Pending' = 'Pending';
          let historyEntryId: string | undefined;
          let notes: string | undefined;

          if (log) {
            status = log.status;
            historyEntryId = log.id;
            notes = log.notes;
          } else {
            // Smart auto-miss logic: If date is today, and time is past, and not logged, it's Missed!
            // Or if date is in the past, it's automatically Missed.
            const todayStr = "2026-07-07"; // Baseline today
            if (queryDateStr < todayStr) {
              status = 'Missed';
            } else if (queryDateStr === todayStr) {
              if (t < currentHourMin) {
                status = 'Missed';
              }
            }
          }

          todayReminders.push({
            medicineId: med.id,
            medicineName: med.name,
            medicineType: med.type,
            dosage: med.dosage,
            strength: med.strength,
            beforeAfterFood: med.beforeAfterFood,
            quantity: med.quantity,
            notes: med.notes || notes,
            time: t,
            date: queryDateStr,
            status,
            historyEntryId,
            doctorName: med.doctorName,
            hospitalName: med.hospitalName,
            image: med.image
          });
        });
      }
    });

    // Sort today's reminders chronologically
    todayReminders.sort((a, b) => a.time.localeCompare(b.time));

    // B. Basic statistics
    const totalMedicinesCount = medicines.length;
    const todayMedicinesCount = todayReminders.length;
    
    const completedToday = todayReminders.filter(r => r.status === 'Taken').length;
    const missedToday = todayReminders.filter(r => r.status === 'Missed').length;
    const skippedToday = todayReminders.filter(r => r.status === 'Skipped').length;
    const pendingToday = todayReminders.filter(r => r.status === 'Pending').length;

    // Upcoming reminders for today (Pending reminders that are still ahead)
    const upcomingReminders = todayReminders.filter(r => r.status === 'Pending');

    // C. Adherence Calculations (using history data)
    // Overall Adherence rate = Taken / (Taken + Missed)
    const allLoggedDoses = history.filter(h => h.status === 'Taken' || h.status === 'Missed');
    const totalTaken = allLoggedDoses.filter(h => h.status === 'Taken').length;
    const totalMissed = allLoggedDoses.filter(h => h.status === 'Missed').length;
    
    const overallAdherence = allLoggedDoses.length > 0 
      ? Math.round((totalTaken / allLoggedDoses.length) * 100) 
      : 100;

    // Today's adherence
    const todayActionable = todayReminders.filter(r => r.status === 'Taken' || r.status === 'Missed');
    const todayAdherence = todayActionable.length > 0
      ? Math.round((completedToday / todayActionable.length) * 100)
      : 100;

    // D. Analytics Charting Data
    // 1. Weekly intake trend (Last 7 days: June 30 to July 7, 2026)
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date("2026-07-07T00:00:00");
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      last7Days.push(dStr);
    }

    const weeklyChart = last7Days.map(dStr => {
      // Doses logged for this date
      const dayLogs = history.filter(h => h.date === dStr);
      const taken = dayLogs.filter(h => h.status === 'Taken').length;
      const missed = dayLogs.filter(h => h.status === 'Missed').length;
      const skipped = dayLogs.filter(h => h.status === 'Skipped').length;
      
      // If no history exists, count how many would have been scheduled if in the range
      let scheduledPending = 0;
      if (dayLogs.length === 0) {
        medicines.forEach(m => {
          if (isScheduledForDate(m, dStr)) {
            const count = m.reminderTime.split(',').length;
            scheduledPending += count;
          }
        });
      }

      // Format simple day name
      const dateObj = new Date(dStr + 'T00:00:00');
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        date: dStr,
        dayName,
        Taken: taken,
        Missed: dayLogs.length > 0 ? missed : (dStr < "2026-07-07" ? scheduledPending : 0),
        Skipped: skipped,
        Pending: dStr === "2026-07-07" ? pendingToday : 0
      };
    });

    // 2. Medicine category distribution
    const categoryDistribution = {
      Tablet: medicines.filter(m => m.type === 'Tablet').length,
      Capsule: medicines.filter(m => m.type === 'Capsule').length,
      Syrup: medicines.filter(m => m.type === 'Syrup').length,
      Injection: medicines.filter(m => m.type === 'Injection').length,
      Drops: medicines.filter(m => m.type === 'Drops').length,
    };

    // E. Intelligent Recommendations Engine (Rule-based)
    const recommendations: string[] = [];
    
    // Rule 1: If any medicine was missed recently (past 2 days)
    const recentMissed = history.filter(h => h.status === 'Missed' && h.date >= '2026-07-05');
    if (recentMissed.length > 0) {
      const names = Array.from(new Set(recentMissed.map(h => h.medicineName))).slice(0, 2).join(', ');
      recommendations.push(`Missed Dose Alert: You recently missed ${names}. Please take your medicine as soon as possible if appropriate.`);
    }

    // Rule 2: If three consecutive doses of any medicine are missed
    // Let's trace back sorted logs for each medicine
    const medDoseLogMap: { [medId: string]: ReminderHistoryEntry[] } = {};
    history.forEach(h => {
      if (!medDoseLogMap[h.medicineId]) medDoseLogMap[h.medicineId] = [];
      medDoseLogMap[h.medicineId].push(h);
    });

    let consecutiveThreeMissed = false;
    for (const medId in medDoseLogMap) {
      // Sort desc
      const sorted = medDoseLogMap[medId].sort((a,b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
      if (sorted.length >= 3) {
        if (sorted[0].status === 'Missed' && sorted[1].status === 'Missed' && sorted[2].status === 'Missed') {
          const medName = sorted[0].medicineName;
          consecutiveThreeMissed = true;
          recommendations.push(`CRITICAL ALERT: You have missed three consecutive doses of ${medName}. We strongly recommend contacting your healthcare provider (Dr. Chen or hospital) immediately.`);
        }
      }
    }

    // Rule 3: Medicine stock running low
    const lowStockMeds = medicines.filter(m => m.quantity <= 5);
    if (lowStockMeds.length > 0) {
      lowStockMeds.forEach(m => {
        recommendations.push(`Low Stock Alert: Your supply of ${m.name} is running low (${m.quantity} units left). Please arrange a refill soon.`);
      });
    }

    // Rule 4: Treatment near completion
    medicines.forEach(m => {
      const today = new Date("2026-07-07T00:00:00");
      const end = new Date(m.endDate + 'T00:00:00');
      const diffTime = end.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 2) {
        recommendations.push(`Treatment Nearing Completion: Your prescribed course for ${m.name} ends in ${diffDays} day${diffDays === 1 ? '' : 's'} (${m.endDate}). Remember to schedule a follow-up with ${m.doctorName || 'your doctor'}.`);
      }
    });

    // Default welcome recommendation if empty
    if (recommendations.length === 0) {
      recommendations.push("Keep up the great work! Your adherence is optimal. Ensure you stay hydrated and take medicines on time.");
    }

    res.json({
      date: queryDateStr,
      time: currentHourMin,
      totalMedicines: totalMedicinesCount,
      todayMedicines: todayMedicinesCount,
      upcomingRemindersCount: upcomingReminders.length,
      missedToday,
      completedToday,
      skippedToday,
      pendingToday,
      adherencePercentage: overallAdherence,
      todayAdherencePercentage: todayAdherence,
      todaySchedule: todayReminders,
      upcomingReminders,
      weeklyChart,
      categoryDistribution,
      recommendations,
      historySummary: history.slice(-5).reverse() // 5 recent history records
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Database Export/Backup/Restore APIs
app.get('/api/database/export', async (req, res) => {
  try {
    const backupData = await JSONDatabase.exportDB();
    res.setHeader('Content-disposition', 'attachment; filename=smart-med-db-backup.json');
    res.setHeader('Content-type', 'application/json');
    res.send(backupData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/database/restore', async (req, res) => {
  try {
    const { databaseContent } = req.body;
    if (!databaseContent) {
      return res.status(400).json({ error: 'Missing databaseContent to restore.' });
    }
    const success = await JSONDatabase.importDB(databaseContent);
    if (success) {
      res.json({ success: true, message: 'Database restored successfully!' });
    } else {
      res.status(400).json({ error: 'Invalid database content schema.' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/database/reset', async (req, res) => {
  try {
    // Force delete existing db file and re-init
    const DB_DIR = path.join(process.cwd(), 'data');
    const DB_FILE = path.join(DB_DIR, 'db.json');
    try {
      await fs.promises.unlink(DB_FILE);
    } catch {}
    await JSONDatabase.init();
    res.json({ success: true, message: 'Database reset to default seed data.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create and mount Vite in development, serve dist/ in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
