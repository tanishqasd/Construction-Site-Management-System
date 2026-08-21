import { apiRequest } from "./api";

export interface ExpenseRecord {
  _id: string;
  site: { _id: string; siteName: string };
  category: "Material" | "Labour" | "Transport" | "Equipment" | "Maintenance" | "Miscellaneous";
  description: string;
  amount: number;
  expenseDate: string;
  status?: string;
}

export const fetchExpenses = () => apiRequest<{ count: number; expenses: ExpenseRecord[] }>("/expenses");
export const createExpense = (data: Partial<ExpenseRecord>) =>
  apiRequest<{ message: string; expense: ExpenseRecord }>("/expenses", {
    method: "POST",
    body: JSON.stringify(data),
  });