import { apiRequest } from "./api";

export interface WorkerRecord {
  _id: string;
  fullName: string;
  phone: string;
  skill: string;
  dailyWage: number;
  status: "Active" | "Inactive";
  assignedSite?: { _id: string; siteName: string } | null;
}

export interface AttendanceRecord {
  _id: string;
  worker: { _id: string; fullName: string; skill: string };
  site: { _id: string; siteName: string };
  status: "Present" | "Absent" | "Half Day";
  date: string;
}

export const fetchWorkers = () => apiRequest<{ count: number; workers: WorkerRecord[] }>("/workers");
export const fetchAttendance = () => apiRequest<{ count: number; attendance: AttendanceRecord[] }>("/attendance");