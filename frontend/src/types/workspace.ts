export interface Entity { _id: string; createdAt?: string; organizationId?: string }
export interface Ref { _id: string; siteName?: string; fullName?: string; location?: string }
export type Relation = string | Ref | null;
export interface SiteRecord extends Entity { siteName: string; location: string; clientName: string; budget: number; progress: number; status: string; startDate: string; expectedEndDate: string; managerName?: string }
export interface WorkerRecord extends Entity { fullName: string; phone: string; email?: string; skill: string; dailyWage: number; status: string; assignedSite: Relation; userId?: string; emergencyContact?: string }
export interface TaskRecord extends Entity { title: string; description?: string; site: Relation; assignedTo?: Relation; priority: string; status: string; dueDate?: string }
export interface MaterialRecord extends Entity { materialName: string; category: string; quantity: number; unit: string; costPerUnit: number; site: Relation; reorderLevel: number; supplier?: string }
export interface ExpenseRecord extends Entity { description: string; category: string; amount: number; expenseDate: string; site: Relation; status: string; paidTo?: string; paymentMethod?: string }
export interface AttendanceRecord extends Entity { worker: Relation; site: Relation; date: string; status: string; shift?: string; notes?: string; dailyRate?: number }
export interface IssueRecord extends Entity { title: string; description: string; severity: string; category: string; status: string; site: Relation; reportedBy?: string }
export interface ReportRecord extends Entity { title: string; date: string; type: string; summary: string; site: Relation; weather?: string; hoursWorked?: number; createdBy?: string }
export interface DocumentRecord extends Entity { title: string; type: string; revision: string; url?: string; attachment?: string; fileName?: string; hasAttachment?: boolean; site: Relation }
export interface TeamRecord extends Entity { name: string; email: string; role: string; active: boolean; assignedSites: string[] }
export interface ContractorRecord extends Entity { companyName: string; contactName: string; phone: string; email?: string; trade: string; crewSize: number; status: string; site: Relation }
export interface WorkspaceData { sites: SiteRecord[]; workers: WorkerRecord[]; contractors: ContractorRecord[]; tasks: TaskRecord[]; materials: MaterialRecord[]; expenses: ExpenseRecord[]; attendance: AttendanceRecord[]; issues: IssueRecord[]; reports: ReportRecord[]; documents: DocumentRecord[]; team: TeamRecord[] }
export type Resource = keyof WorkspaceData;
export type RecordEntity = WorkspaceData[Resource][number];
export const emptyWorkspace = (): WorkspaceData => ({ sites: [], workers: [], contractors: [], tasks: [], materials: [], expenses: [], attendance: [], issues: [], reports: [], documents: [], team: [] });
export const refId = (relation?: Relation): string => typeof relation === 'string' ? relation : relation?._id || '';
export const dateInput = (date = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(date);
