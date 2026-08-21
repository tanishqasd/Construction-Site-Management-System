import { apiRequest } from "./api";

export interface IssueItem {
  _id: string;
  title: string;
  description: string;
  site: { _id: string; siteName: string; location: string };
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Review" | "Resolved" | "Closed";
  createdAt: string;
}

export const fetchIssues = () =>
  apiRequest<{ count: number; issues: IssueItem[] }>("/issues");

export const createIssue = (data: Partial<IssueItem>) =>
  apiRequest<{ message: string; issue: IssueItem }>("/issues", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateIssueStatus = (id: string, status: IssueItem["status"]) =>
  apiRequest<{ message: string; issue: IssueItem }>(`/issues/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });