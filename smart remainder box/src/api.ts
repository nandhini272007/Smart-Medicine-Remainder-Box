import axios from 'axios';
import { Medicine, ReminderHistoryEntry, AppSettings, DashboardData } from './types.js';

// Create an Axios instance pointing to our server API
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboard = async (date?: string, time?: string): Promise<DashboardData> => {
  const response = await API.get<DashboardData>('/dashboard', {
    params: { date, time },
  });
  return response.data;
};

export const getMedicines = async (params?: {
  q?: string;
  type?: string;
  repeatSchedule?: string;
  beforeAfterFood?: string;
  page?: number;
  limit?: number;
}): Promise<{ medicines: Medicine[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> => {
  const response = await API.get('/medicines', { params });
  return response.data;
};

export const addMedicine = async (medicine: Omit<Medicine, 'id' | 'createdAt'>): Promise<Medicine> => {
  const response = await API.post<Medicine>('/medicines', medicine);
  return response.data;
};

export const updateMedicine = async (id: string, medicine: Partial<Omit<Medicine, 'id' | 'createdAt'>>): Promise<Medicine> => {
  const response = await API.put<Medicine>(`/medicines/${id}`, medicine);
  return response.data;
};

export const deleteMedicine = async (id: string): Promise<{ success: boolean; id: string }> => {
  const response = await API.delete<{ success: boolean; id: string }>(`/medicines/${id}`);
  return response.data;
};

export const getHistory = async (params?: {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ history: ReminderHistoryEntry[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> => {
  const response = await API.get('/history', { params });
  return response.data;
};

export const logReminderAction = async (entry: Omit<ReminderHistoryEntry, 'id'>): Promise<ReminderHistoryEntry> => {
  const response = await API.post<ReminderHistoryEntry>('/history/action', entry);
  return response.data;
};

export const getSettings = async (): Promise<AppSettings> => {
  const response = await API.get<AppSettings>('/settings');
  return response.data;
};

export const updateSettings = async (settings: Partial<AppSettings>): Promise<AppSettings> => {
  const response = await API.post<AppSettings>('/settings', settings);
  return response.data;
};

export const exportDatabase = async (): Promise<any> => {
  const response = await API.get('/database/export');
  return response.data;
};

export const restoreDatabase = async (jsonStr: string): Promise<{ success: boolean; message: string }> => {
  const response = await API.post<{ success: boolean; message: string }>('/database/restore', { databaseContent: jsonStr });
  return response.data;
};

export const resetDatabase = async (): Promise<{ success: boolean; message: string }> => {
  const response = await API.post<{ success: boolean; message: string }>('/database/reset');
  return response.data;
};
