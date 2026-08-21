import { apiRequest } from "./api";

export interface Site {
  _id: string;
  siteName: string;
  location: string;
  clientName: string;
  budget: number;
  startDate: string;
  expectedEndDate: string;
  status: "Planning" | "Ongoing" | "Completed";
}

export const getSites = () => apiRequest<{ count: number; sites: Site[] }>("/sites");
export const createSite = (data: Partial<Site>) =>
  apiRequest<{ message: string; site: Site }>("/sites", {
    method: "POST",
    body: JSON.stringify(data),
  });