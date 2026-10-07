import { demoWorkspace } from './fixtures';
import { DEMO_DATA_KEY, readDemoUser } from './session';
import { emptyWorkspace, dateInput, refId, type Resource, type WorkspaceData } from '../types/workspace';
import type { User } from '../context/authSession';
import type { Role } from '../utils/permissions';

type Row = Record<string, unknown>;
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const keys = Object.keys(emptyWorkspace()) as Resource[];
const fields: Record<Resource, string[]> = {
  sites: ['siteName','location','clientName','budget','progress','status','startDate','expectedEndDate','managerName'],
  workers: ['fullName','phone','email','skill','dailyWage','status','assignedSite','emergencyContact'],
  contractors: ['companyName','contactName','phone','email','trade','crewSize','status','site'],
  tasks: ['title','description','site','assignedTo','priority','status','dueDate'],
  materials: ['materialName','category','quantity','unit','costPerUnit','site','reorderLevel','supplier'],
  expenses: ['description','category','amount','expenseDate','site','status','paidTo','paymentMethod'],
  attendance: ['worker','site','date','status','shift','notes'],
  issues: ['title','description','severity','category','status','site'],
  reports: ['title','date','type','summary','site','weather','hoursWorked'],
  documents: ['title','type','revision','url','attachment','fileName','site'],
  team: ['name','email','role','active','assignedSites','workerId'],
};
const rows = (data: WorkspaceData, resource: Resource): Row[] => data[resource] as unknown as Row[];
const relation = (value: unknown) => refId(value as Parameters<typeof refId>[0]);
function readData(): WorkspaceData {
  try {
    const stored = JSON.parse(localStorage.getItem(DEMO_DATA_KEY) || 'null');
    if (stored?.version === 1 && keys.every((key) => Array.isArray(stored.data?.[key]) && stored.data[key].every((row: Row) => row && typeof row._id === 'string'))) return clone(stored.data);
  } catch { /* a damaged demo does not affect real sessions */ }
  return demoWorkspace();
}
function writeData(data: WorkspaceData) {
  try { localStorage.setItem(DEMO_DATA_KEY, JSON.stringify({version:1,data})); }
  catch { throw new Error('Demo storage is full or unavailable. Remove a large sample file or reset the demo.'); }
}
export function resetDemoData() {
  if (!readDemoUser()) throw new Error('Open a demo persona first.');
  writeData(demoWorkspace());
}
function scope(data: WorkspaceData, user: User): WorkspaceData {
  const role = user.role as Role;
  if (role === 'owner') return clone(data);
  const worker = data.workers.find((entry) => entry.userId === user._id);
  const siteIds = role === 'hr' ? user.assignedSites || [] : worker?.assignedSite ? [refId(worker.assignedSite)] : [];
  const inSite = (site: unknown) => siteIds.includes(relation(site));
  return {
    sites: data.sites.filter((entry) => siteIds.includes(entry._id)),
    workers: data.workers.filter((entry) => role === 'hr' ? inSite(entry.assignedSite) : entry._id === worker?._id),
    contractors: role === 'hr' ? data.contractors.filter((entry) => inSite(entry.site)) : [],
    tasks: data.tasks.filter((entry) => inSite(entry.site) && (role === 'hr' || refId(entry.assignedTo) === worker?._id)),
    materials: role === 'hr' ? data.materials.filter((entry) => inSite(entry.site)) : [],
    expenses: [], team: [],
    attendance: data.attendance.filter((entry) => role === 'hr' ? inSite(entry.site) : refId(entry.worker) === worker?._id),
    issues: data.issues.filter((entry) => inSite(entry.site) && (role === 'hr' || entry.reportedBy === user._id)),
    reports: data.reports.filter((entry) => inSite(entry.site) && (role === 'hr' || entry.createdBy === user._id)),
    documents: data.documents.filter((entry) => inSite(entry.site)),
  };
}
function allowed(role: Role, resource: Resource, method: string) {
  if (role === 'owner') return true;
  if (role === 'hr') return !['expenses','team'].includes(resource) && !(resource === 'sites' && ['POST','DELETE'].includes(method));
  if (method === 'GET') return ['sites','workers','tasks','attendance','issues','reports','documents'].includes(resource);
  return resource === 'tasks' && method === 'PUT' || ['issues','reports'].includes(resource) && method === 'POST';
}
function validate(data: WorkspaceData, visible: WorkspaceData, resource: Resource, record: Row, user: User) {
  const enums: Partial<Record<Resource, Record<string, string[]>>> = {
    sites: { status:['Planning','Ongoing','Completed'] }, workers:{status:['Active','Inactive']},
    tasks: {status:['Pending','In Progress','Blocked','Completed'],priority:['Low','Medium','High','Critical']},
    expenses:{status:['Pending','Approved','Rejected','Paid']},issues:{status:['Open','In Review','Resolved','Closed'],severity:['Low','Medium','High','Critical']},
    reports:{type:['Daily progress','Safety inspection']},contractors:{status:['Active','On hold','Completed']},
  };
  if (resource === 'reports' && user.role === 'worker') record.type = 'Safety inspection';
  for (const [field, values] of Object.entries(enums[resource] || {})) if (record[field] !== undefined && !values.includes(String(record[field]))) throw new Error('Choose a valid status or category.');
  const site = relation(resource === 'workers' ? record.assignedSite : record.site);
  if (resource !== 'sites' && resource !== 'team' && (!site || !visible.sites.some((entry) => entry._id === site))) throw new Error('Choose a site within this demo role’s assignments.');
  if (resource === 'tasks' && record.assignedTo && !visible.workers.some((entry) => entry._id === relation(record.assignedTo) && refId(entry.assignedSite) === site)) throw new Error('Choose a worker assigned to this site.');
  for (const key of ['budget','progress','dailyWage','crewSize','quantity','costPerUnit','reorderLevel','amount','hoursWorked']) {
    if (record[key] !== undefined && record[key] !== '') { const value = Number(record[key]); if (!Number.isFinite(value) || value < 0) throw new Error('Amounts and quantities must be non-negative numbers.'); record[key] = value; }
  }
  if (Number(record.progress) > 100 || Number(record.hoursWorked) > 24 || resource === 'contractors' && !Number.isInteger(record.crewSize)) throw new Error('Check progress, hours or crew size.');
  if (resource === 'attendance') {
    const worker = data.workers.find((entry) => entry._id === relation(record.worker) && refId(entry.assignedSite) === site);
    if (!worker || typeof record.date !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(record.date) || record.date.slice(0,10) > dateInput()) throw new Error('Choose a site worker and a valid attendance date up to today.');
    record.date = record.date.slice(0,10);
    if (!['Present','Half Day','Absent'].includes(String(record.status))) throw new Error('Choose a valid attendance status.');
    if (record.dailyRate === undefined) record.dailyRate = worker.dailyWage;
  }
  if (resource === 'expenses' && record.status === 'Paid' && (!record.paidTo || !record.paymentMethod)) throw new Error('A Paid expense needs a payee and payment method.');
  if (resource === 'reports' && user.role === 'worker') record.type = 'Safety inspection';
  if (resource === 'documents') {
    if (!record.url && !record.attachment) throw new Error('Provide a document link or upload a file.');
    if (record.url) { let url: URL; try { url = new URL(String(record.url)); } catch { throw new Error('Enter a valid document link.'); } if (!['https:','http:'].includes(url.protocol) || url.username || url.password) throw new Error('Use an HTTP(S) document link without credentials.'); }
    if (record.attachment && (!/^data:(application\/pdf|image\/png|image\/jpeg);base64,[A-Za-z0-9+/=]+$/.test(String(record.attachment)) || String(record.attachment).length > 2800000 || atob(String(record.attachment).split(',')[1]).length > 2097152)) throw new Error('Upload a PDF, PNG or JPEG up to 2 MB.');
    record.hasAttachment = !!record.attachment;
  }
  if (resource === 'team') {
    if (!['hr','worker'].includes(String(record.role)) && record._id !== 'demo-owner') throw new Error('Choose HR or Worker access.');
    if (record.role === 'hr' && (!Array.isArray(record.assignedSites) || !record.assignedSites.length || record.assignedSites.some((id) => !visible.sites.some((site) => site._id === id)))) throw new Error('Assign at least one available site to the manager.');
    if (record.role === 'worker' && !data.workers.some((worker) => (worker._id === record.workerId || worker.userId === record._id) && (!worker.userId || worker.userId === record._id) && worker.status === 'Active')) throw new Error('Link an active worker without another demo account.');
  }
}
export async function demoRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const user = readDemoUser(); if (!user) throw new Error('The demo session ended. Choose a persona again.');
  const data = readData(); const visible = scope(data, user); const method = (options.method || 'GET').toUpperCase();
  const parts = endpoint.replace(/^\//,'').split('/'); const resource = parts[0] as Resource; const id = parts[1];
  const result = (value: unknown) => clone(value) as T;
  if (endpoint === '/workspace' && method === 'GET') return result({ ...visible, documents: visible.documents.map(({attachment: _attachment, ...document}) => document) });
  if (endpoint === '/auth/me' && method === 'GET') return result({user});
  if (endpoint === '/user/password' || resource === 'team' && parts[2] === 'password') throw new Error('Demo credentials are fixed. Password changes and real account access require Client sign-in.');
  let body: Row = {};
  if (options.body) { try { body = JSON.parse(String(options.body)); } catch { throw new Error('Provide valid form data.'); } if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Provide valid form data.'); }
  if (endpoint === '/user/profile') {
    if (method === 'PUT') { if (typeof body.name !== 'string' || !body.name.trim() || body.name.length > 120) throw new Error('Enter a name of 1–120 characters.'); const member = data.team.find((entry) => entry._id === user._id); if (!member) throw new Error('Reset the demo to restore this persona.'); member.name = body.name.trim(); writeData(data); return result({user:{...user,name:member.name}}); }
    if (method === 'GET') return result({user});
  }
  if (!keys.includes(resource) || !['GET','POST','PUT','DELETE'].includes(method)) throw new Error('This action is unavailable in the demo workspace.');
  if (!allowed(user.role as Role, resource, method)) throw new Error('Your demo role does not have permission for this action.');
  if (['PUT','DELETE'].includes(method) && !id) throw new Error('Choose the record to change.');
  const existing = id ? rows(visible, resource).find((entry) => entry._id === id) : undefined;
  if (id && !existing) throw new Error('This record is outside your demo role’s workspace.');
  if (method === 'GET') return result(id ? existing : visible[resource]);
  if (method === 'DELETE') {
    if (resource === 'sites' && keys.filter((key) => !['sites','team'].includes(key)).some((key) => rows(data,key).some((entry) => relation(entry.site || entry.assignedSite) === id)) || resource === 'workers' && (existing?.userId || data.tasks.some((entry) => refId(entry.assignedTo) === id) || data.attendance.some((entry) => refId(entry.worker) === id)) || resource === 'expenses' && existing?.status === 'Paid') throw new Error('This record has operational history and cannot be deleted.');
    if (resource === 'team') throw new Error('Disable a sample account instead of deleting it.');
    const list = rows(data,resource); list.splice(list.findIndex((entry) => entry._id === id),1); writeData(data); return result({message:'Sample record removed.'});
  }
  let permitted = fields[resource];
  if (resource === 'tasks' && user.role === 'worker') permitted = ['status'];
  if (resource === 'sites' && user.role === 'hr') permitted = ['status','progress'];
  const payload = Object.fromEntries(permitted.filter((key) => body[key] !== undefined).map((key) => [key,body[key]]));
  let target = existing;
  if (resource === 'attendance' && method === 'POST') target = rows(data,'attendance').find((entry) => relation(entry.worker) === relation(payload.worker) && String(entry.date).slice(0,10) === String(payload.date).slice(0,10));
  const record: Row = { ...target, ...payload, _id: target?._id || `${resource}-${crypto.randomUUID()}`, organizationId:'demo-owner' };
  if (resource === 'issues' && !target) record.reportedBy = user._id;
  if (resource === 'reports' && !target) record.createdBy = user._id;
  if (resource === 'team' && String(record._id).startsWith('demo-') && (record.role !== target?.role || record.active === false)) throw new Error('The three demo personas keep their roles and stay enabled.');
  validate(data,visible,resource,record,user);
  const list = rows(data,resource); const index = list.findIndex((entry) => entry._id === record._id);
  if (index < 0) list.push(record); else list[index] = record;
  if (resource === 'team' && record.role === 'worker') { const worker = data.workers.find((entry) => entry._id === record.workerId); if (worker) worker.userId = String(record._id); }
  writeData(data); return result({record});
}
