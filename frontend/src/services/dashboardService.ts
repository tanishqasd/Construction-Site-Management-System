import { apiRequest } from "./api";

export interface DashboardMetrics {
  totalWorkers: number;
  activeWorkers: number;
  inactiveWorkers: number;
  totalSites: number;
  ongoingSites: number;
  completedSites: number;
  totalMaterials: number;
  todayAttendance: number;
}

export const getDashboardMetrics = () => apiRequest<DashboardMetrics>("/dashboard");