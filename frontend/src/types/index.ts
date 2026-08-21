export type ProjectStatus = 'On Track' | 'At Risk' | 'Delayed' | 'Completed' | 'Planning';

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  location: string;
  status: ProjectStatus;
  progress: number;
  plannedProgress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  manager: string;
  engineer: string;
  openIssues: number;
  workforce: number;
  phase: string;
}

export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Review' | 'Completed';

export interface Task {
  id: string;
  title: string;
  projectCode: string;
  projectName: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  overdueDays: number;
  progress: number;
  wbs: string;
}

export type MaterialState = 'Critical' | 'Low' | 'Healthy' | 'Ordered';

export interface Material {
  id: string;
  name: string;
  unit: string;
  projectCode: string;
  inStock: number;
  reorderLevel: number;
  consumedThisWeek: number;
  state: MaterialState;
  supplier: string;
  lastDelivery: string;
  rate: number;
}

export interface LabourRecord {
  id: string;
  crew: string;
  contractor: string;
  projectCode: string;
  trade: string;
  strength: number;
  present: number;
  shift: 'Day' | 'Night';
  supervisor: string;
  dailyWage: number;
}

export type ExpenseStatus = 'Approved' | 'Pending' | 'Rejected' | 'Reimbursed';

export interface Expense {
  id: string;
  voucher: string;
  category: string;
  projectCode: string;
  amount: number;
  date: string;
  raisedBy: string;
  status: ExpenseStatus;
  note: string;
}

export type IssueSeverity = 'Blocker' | 'Major' | 'Minor';
export type IssueStatus = 'Open' | 'In Review' | 'Resolved';

export interface Issue {
  id: string;
  ref: string;
  title: string;
  projectCode: string;
  location: string;
  severity: IssueSeverity;
  status: IssueStatus;
  category: string;
  raisedBy: string;
  raisedOn: string;
  ageDays: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'Drawing' | 'Contract' | 'Permit' | 'Report' | 'Certificate';
  projectCode: string;
  revision: string;
  size: string;
  uploadedBy: string;
  uploadedOn: string;
  status: 'Approved' | 'For Review' | 'Superseded';
}

export interface ActivityEvent {
  id: string;
  kind: 'progress' | 'material' | 'issue' | 'labour' | 'document' | 'expense' | 'photo';
  actor: string;
  role: string;
  message: string;
  projectCode: string;
  time: string;
}

export interface AlertItem {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  projectCode: string;
  meta: string;
}