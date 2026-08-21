import { apiRequest } from "./api";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  site: { _id: string; siteName: string } | string;
  assignedTo?: { _id: string; fullName: string } | string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Pending" | "In Progress" | "Completed" | "Blocked";
  dueDate?: string;
}

export const getTasks = () => apiRequest<{ count: number; tasks: Task[] }>("/tasks");
export const createTask = (data: Partial<Task>) =>
  apiRequest<{ message: string; task: Task }>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateTaskStatus = (id: string, status: Task["status"]) =>
  apiRequest<{ message: string; task: Task }>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });