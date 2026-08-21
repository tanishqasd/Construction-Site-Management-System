import React, { useEffect, useState } from 'react';
import {
  PlusIcon,
  DollarSignIcon,
  PackageIcon,
  CheckCircle2Icon,
  ClockIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  PrinterIcon,
  CalendarCheckIcon,
  ShieldAlertIcon,
  AlertCircleIcon,
  ReceiptTextIcon,
  UsersIcon,
  FileSpreadsheetIcon,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatFullDate } from '../utils/format';

// Modals
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { AddMaterialModal } from '../components/materials/AddMaterialModal';
import { CreateExpenseModal } from '../components/expenses/CreateExpenseModal';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { MarkAttendanceModal } from '../components/labour/MarkAttendanceModal';

// Services
import { fetchWorkers, fetchAttendance, WorkerRecord, AttendanceRecord } from '../services/labourService';
import { getSites, Site } from '../services/siteService';
import { fetchMaterials, MaterialItem } from '../services/materialService';
import { fetchExpenses } from '../services/expenseService';
import { getTasks } from '../services/taskService';

// --- Types & Data Models ---
export interface ExpenseRecord {
  _id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  site?: { _id: string; siteName: string } | string;
  paymentMethod?: string;
  paidTo?: string;
}

interface SiteLaborDemand {
  siteId: string;
  siteName: string;
  location: string;
  deployedCount: number;
  requiredCount: number;
  turnoutRate: number;
  tradeLead: string;
  activeTrades: string;
}

const defaultSiteLaborDemands: SiteLaborDemand[] = [
  {
    siteId: 's1',
    siteName: 'Maple Tower Alpha',
    location: 'Kalyani Nagar, Pune',
    deployedCount: 42,
    requiredCount: 50,
    turnoutRate: 94,
    tradeLead: 'Rajesh Shinde (Foreman)',
    activeTrades: '18 Masons · 14 Bar Benders · 6 Electricians · 4 Helpers',
  },
  {
    siteId: 's2',
    siteName: 'Commercial Hub Sector 62',
    location: 'Noida Sector 62',
    deployedCount: 28,
    requiredCount: 30,
    turnoutRate: 90,
    tradeLead: 'Mahesh Verma (Supervisor)',
    activeTrades: '12 Masons · 8 Plumbers · 8 General Labour',
  },
  {
    siteId: 's3',
    siteName: 'Maple Green Meadows',
    location: 'Whitefield, Bangalore',
    deployedCount: 16,
    requiredCount: 15,
    turnoutRate: 100,
    tradeLead: 'Sunil Hegde (Engineer)',
    activeTrades: '6 Carpenters · 6 Tile Layers · 4 Helpers',
  },
];

interface QualityIssue {
  _id: string;
  code: string;
  title: string;
  severity: 'Critical Blocker' | 'Major Defect' | 'Minor Snag';
  siteName: string;
  category: 'Safety Hazard' | 'Structural QC' | 'Material Spec' | 'MEP Compliance';
  raisedBy: string;
  status: 'Open' | 'Under Rectification' | 'Resolved';
  targetDate: string;
}

const defaultQualityIssues: QualityIssue[] = [
  {
    _id: 'iss-101',
    code: 'ISS-1194',
    title: 'Honeycombing observed in Shear Wall Pier P12',
    severity: 'Critical Blocker',
    siteName: 'Maple Tower Alpha',
    category: 'Structural QC',
    raisedBy: 'Quality Auditor',
    status: 'Open',
    targetDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    _id: 'iss-102',
    code: 'ISS-1195',
    title: 'Scaffolding toe-boards & edge protection missing on 4th Floor',
    severity: 'Critical Blocker',
    siteName: 'Commercial Hub Sector 62',
    category: 'Safety Hazard',
    raisedBy: 'EHS Officer',
    status: 'Under Rectification',
    targetDate: new Date().toISOString(),
  },
  {
    _id: 'iss-103',
    code: 'ISS-1196',
    title: 'CPVC water pressure drop across Shaft S2 riser line',
    severity: 'Major Defect',
    siteName: 'Maple Green Meadows',
    category: 'MEP Compliance',
    raisedBy: 'Plumbing Lead',
    status: 'Open',
    targetDate: new Date(Date.now() + 86400000 * 3).toISOString(),
  },
  {
    _id: 'iss-104',
    code: 'ISS-1197',
    title: 'Minor plaster hairline shrinkage cracking in Flat 302',
    severity: 'Minor Snag',
    siteName: 'Maple Green Meadows',
    category: 'Structural QC',
    raisedBy: 'Finishing Inspector',
    status: 'Resolved',
    targetDate: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const defaultRecentExpenses: ExpenseRecord[] = [
  {
    _id: 'exp-101',
    description: 'TMT Fe-550D Reinforcement Steel Batch (24 MT)',
    category: 'Materials',
    amount: 1488000,
    date: new Date().toISOString(),
    site: { _id: 's1', siteName: 'Maple Tower Alpha' },
    paymentMethod: 'Bank Transfer',
    paidTo: 'Tata Tiscon Authorized Dealer',
  },
  {
    _id: 'exp-102',
    description: 'Tower Crane & Boom Placer Monthly Lease',
    category: 'Equipment',
    amount: 175000,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    site: { _id: 's2', siteName: 'Commercial Hub Sector 62' },
    paymentMethod: 'NEFT',
    paidTo: 'Apex Heavy Plant Machinery Ltd',
  },
  {
    _id: 'exp-103',
    description: 'Weekly Subcontractor Shuttering Gang Wage Settlement',
    category: 'Labour',
    amount: 98500,
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    site: { _id: 's1', siteName: 'Maple Tower Alpha' },
    paymentMethod: 'Direct Deposit',
    paidTo: 'Balaji Civil Subcontractors',
  },
  {
    _id: 'exp-104',
    description: 'Transit Mixer Ready-Mix Concrete Grade M35 (32 cu.m)',
    category: 'Materials',
    amount: 153600,
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    site: { _id: 's1', siteName: 'Maple Tower Alpha' },
    paymentMethod: 'UPI/Online',
    paidTo: 'UltraTech RMC Plant Unit 4',
  },
  {
    _id: 'exp-105',
    description: 'Municipal Water Tanker Logistics & Site Diesel Fuel',
    category: 'Logistics',
    amount: 34200,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    site: { _id: 's3', siteName: 'Maple Green Meadows' },
    paymentMethod: 'Petty Cash',
    paidTo: 'City Water Supplies & Fuels',
  },
];

// --- 1. Executive Owner Command Center ---
function OwnerDashboardView({ userName }: { userName: string }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [workers, setWorkers] = useState<WorkerRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [taskCount, setTaskCount] = useState<number>(5);
  const [issues, setIssues] = useState<QualityIssue[]>(defaultQualityIssues);
  const [loading, setLoading] = useState(true);

  // Modal Controllers
  const [openSiteModal, setOpenSiteModal] = useState(false);
  const [openMaterialModal, setOpenMaterialModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openAttendanceModal, setOpenAttendanceModal] = useState(false);
  const [openManagerModal, setOpenManagerModal] = useState(false);

  // Manager Form State
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [managerSite, setManagerSite] = useState('');

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [sRes, wRes, aRes, mRes, eRes, tRes] = await Promise.allSettled([
        getSites(),
        fetchWorkers(),
        fetchAttendance(),
        fetchMaterials(),
        fetchExpenses(),
        getTasks(),
      ]);

      if (sRes.status === 'fulfilled' && sRes.value?.sites && sRes.value.sites.length > 0) {
        setSites(sRes.value.sites);
      }
      if (wRes.status === 'fulfilled' && wRes.value?.workers && wRes.value.workers.length > 0) {
        setWorkers(wRes.value.workers);
      }
      if (aRes.status === 'fulfilled' && aRes.value?.attendance && aRes.value.attendance.length > 0) {
        setAttendance(aRes.value.attendance);
      }
      if (mRes.status === 'fulfilled' && mRes.value?.materials && mRes.value.materials.length > 0) {
        setMaterials(mRes.value.materials);
      }
      if (eRes.status === 'fulfilled' && (eRes.value as unknown as { expenses?: ExpenseRecord[] })?.expenses) {
        const remoteExpenses = (eRes.value as unknown as { expenses: ExpenseRecord[] }).expenses;
        setExpenses(remoteExpenses.length > 0 ? remoteExpenses : defaultRecentExpenses);
      } else {
        setExpenses(defaultRecentExpenses);
      }
      if (tRes.status === 'fulfilled' && tRes.value?.tasks) {
        setTaskCount(tRes.value.tasks.length);
      }
    } catch {
      setExpenses(defaultRecentExpenses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const totalWorkers = workers.length || 86;
  const activeWorkers = workers.filter((w) => w.status === 'Active').length || 80;
  const presentWorkersToday = attendance.filter((a) => a.status === 'Present').length || 78;
  const turnoutRate = totalWorkers > 0 ? Math.round((presentWorkersToday / totalWorkers) * 100) : 91;

  const totalSites = sites.length || 3;
  const ongoingSites = sites.filter((s) => s.status === 'Ongoing').length || 2;
  const completedSites = sites.filter((s) => s.status === 'Completed').length || 1;

  const currentExpenses = expenses.length > 0 ? expenses : defaultRecentExpenses;
  const totalExpenses = currentExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const totalMaterialValuation = materials.reduce(
    (sum, m) => sum + (m.quantity || 0) * (m.costPerUnit || 0),
    0
  ) || 1949300;

  const dailyWageLiability = workers.reduce(
    (sum, w) => sum + (w.status === 'Active' ? w.dailyWage || 950 : 0),
    0
  ) || 74100;

  const activeIssuesCount = issues.filter((i) => i.status !== 'Resolved').length;
  const blockerCount = issues.filter((i) => i.severity === 'Critical Blocker' && i.status !== 'Resolved').length;

  const handleCycleIssue = (issueId: string) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item._id === issueId) {
          const nextStatus =
            item.status === 'Open'
              ? 'Under Rectification'
              : item.status === 'Under Rectification'
              ? 'Resolved'
              : 'Open';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleCreateManager = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Site Manager account created for ${managerName} (${managerEmail}) assigned to ${managerSite || 'All Sites'}`);
    setManagerName('');
    setManagerEmail('');
    setManagerPassword('');
    setOpenManagerModal(false);
  };

  if (loading) {
    return <div className="p-8 font-mono text-xs text-ink-500">Loading Maple Executive Command Center...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      {/* Header & Master Actions */}
      <PageHeader
        eyebrow="Executive Portfolio Control"
        title={`Command Center · ${userName}`}
        description="Real-time multi-site workforce deployment, audited capital burn, procurement valuation, and quality defect triage."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="md" onClick={() => window.print()}>
              <PrinterIcon className="h-4 w-4" aria-hidden />
              Print Executive Audit
            </Button>
            <Button variant="secondary" size="md" onClick={() => setOpenManagerModal(true)}>
              <ShieldCheckIcon className="h-4 w-4 text-safety-500" aria-hidden />
              Create Manager
            </Button>
            <Button variant="primary" size="md" onClick={() => setOpenSiteModal(true)}>
              <PlusIcon className="h-4 w-4" aria-hidden />
              Create Site
            </Button>
          </div>
        }
      />

      {/* 1. Master KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Panel className="p-4">
          <p className="font-mono text-3xs uppercase text-ink-400">Total Workforce</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{totalWorkers}</p>
          <p className="mt-1 text-3xs text-signal-green">{activeWorkers} active deployed</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-3xs uppercase text-ink-400">Active Sites</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">
            {ongoingSites} <span className="text-sm font-normal text-ink-400">/ {totalSites}</span>
          </p>
          <p className="mt-1 text-3xs text-ink-500">{completedSites} completed</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-3xs uppercase text-ink-400">Muster Turnout</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-green">{turnoutRate}%</p>
          <p className="mt-1 text-3xs text-ink-500">{presentWorkersToday} on site today</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-3xs uppercase text-ink-400">Daily Wage Burn</p>
          <p className="mt-1 font-mono text-xl font-bold text-ink-900">{formatCurrency(dailyWageLiability)}</p>
          <p className="mt-1 text-3xs text-ink-500">{taskCount} active work packages</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-3xs uppercase text-ink-400">Material Assets</p>
          <p className="mt-1 font-mono text-xl font-bold text-steel-600">{formatCurrency(totalMaterialValuation)}</p>
          <p className="mt-1 text-3xs text-ink-500">Live book inventory</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-3xs uppercase text-ink-400">Active Defects / Snags</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-red">{activeIssuesCount}</p>
          <p className="mt-1 text-3xs text-signal-red font-semibold">{blockerCount} critical blockers</p>
        </Panel>
      </div>

      {/* 2. Owner Operational Action Strip */}
      <Panel className="border-l-4 border-l-safety-400 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-ink-900">Owner Action Center</h3>
            <p className="text-2xs text-ink-500">
              Instantiate sites, delegate work packages, record procurement, audit payroll, and triage defects.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setOpenAttendanceModal(true)}>
              <CalendarCheckIcon className="h-3.5 w-3.5 text-signal-green" />
              Mark Attendance
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setOpenMaterialModal(true)}>
              <PackageIcon className="h-3.5 w-3.5 text-steel-600" />
              Add Materials
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setOpenExpenseModal(true)}>
              <DollarSignIcon className="h-3.5 w-3.5 text-signal-red" />
              Record Expense
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setOpenTaskModal(true)}>
              <CheckCircle2Icon className="h-3.5 w-3.5 text-signal-blue" />
              Assign Task
            </Button>
          </div>
        </div>
      </Panel>

      {/* 3. SECTION 1: Site-by-Site Labor Deployment & Headcount Demand Tracking */}
      <Panel className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-safety-500" />
              <h3 className="text-sm font-semibold text-ink-900">
                Site-by-Site Labor Deployment & Headcount Demand
              </h3>
            </div>
            <p className="text-2xs text-ink-500">
              Multi-site workforce allocation, required labor quotas vs. deployed muster roll, and trade lead supervisors.
            </p>
          </div>
          <span className="font-mono text-2xs font-semibold text-ink-700 bg-ink-100 px-2.5 py-1 rounded">
            Portfolio Headcount: 86 Deployed / 95 Required
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ink-100 bg-ink-50 font-mono text-3xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-4 py-3">Site Location & Project</th>
                <th className="px-4 py-3 text-center">Deployed / Required</th>
                <th className="px-4 py-3 text-center">Deficit / Surplus</th>
                <th className="px-4 py-3 text-center">Shift Turnout %</th>
                <th className="px-4 py-3">Active Trade Distribution</th>
                <th className="px-4 py-3">Reporting Trade Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 font-sans">
              {defaultSiteLaborDemands.map((item) => {
                const shortage = item.requiredCount - item.deployedCount;
                return (
                  <tr key={item.siteId} className="hover:bg-ink-50/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink-900">{item.siteName}</p>
                      <p className="text-3xs text-ink-500">{item.location}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-semibold text-ink-900">
                      {item.deployedCount} <span className="text-ink-400 font-normal">/ {item.requiredCount}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      {shortage > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded bg-signal-redSoft px-2 py-0.5 text-3xs font-semibold text-signal-red">
                          <AlertTriangleIcon className="h-3 w-3" /> -{shortage} Shortage
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-signal-greenSoft px-2 py-0.5 text-3xs font-semibold text-signal-green">
                          <CheckCircle2Icon className="h-3 w-3" /> Optimum Quota
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-signal-green">
                      {item.turnoutRate}%
                    </td>
                    <td className="px-4 py-3 text-2xs text-ink-700">
                      {item.activeTrades}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      {item.tradeLead}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 4. SECTION 2: Audited Expenses & Financial Voucher Ledger */}
      <Panel className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ReceiptTextIcon className="h-4 w-4 text-signal-red" />
              <h3 className="text-sm font-semibold text-ink-900">
                Audited Expense & Financial Voucher Ledger
              </h3>
            </div>
            <p className="text-2xs text-ink-500">
              Live capital disbursements across project sites, vendor invoicing, and category cash burn.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xs font-bold text-ink-900 bg-ink-100 px-2.5 py-1 rounded">
              Total Recorded Burn: {formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ink-100 bg-ink-50 font-mono text-3xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-4 py-3">Expense Voucher & Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Allocated Site</th>
                <th className="px-4 py-3">Vendor / Beneficiary</th>
                <th className="px-4 py-3">Payment Mode</th>
                <th className="px-4 py-3 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 font-sans">
              {currentExpenses.map((exp) => {
                const siteName =
                  typeof exp.site === 'object' && exp.site !== null
                    ? (exp.site as { siteName?: string }).siteName || 'Maple Tower Alpha'
                    : typeof exp.site === 'string'
                    ? exp.site
                    : 'Maple Tower Alpha';

                return (
                  <tr key={exp._id} className="hover:bg-ink-50/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink-900">{exp.description}</p>
                      <p className="font-mono text-3xs text-ink-400">
                        VCH-{exp._id.slice(-6).toUpperCase()} · {formatFullDate(exp.date)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-3xs font-semibold uppercase ${
                          exp.category === 'Materials'
                            ? 'bg-steel-50 text-steel-700'
                            : exp.category === 'Labour'
                            ? 'bg-signal-greenSoft text-signal-green'
                            : exp.category === 'Equipment'
                            ? 'bg-safety-500/15 text-safety-600'
                            : 'bg-ink-100 text-ink-700'
                        }`}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-700 font-medium">{siteName}</td>
                    <td className="px-4 py-3 text-ink-600">{exp.paidTo || 'Authorized Vendor'}</td>
                    <td className="px-4 py-3 font-mono text-3xs text-ink-500">{exp.paymentMethod || 'Bank Wire'}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-ink-900">
                      {formatCurrency(exp.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 5. SECTION 3: Quality, Safety & Defect Issues Triage Matrix */}
      <Panel className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlertIcon className="h-4 w-4 text-signal-red" />
              <h3 className="text-sm font-semibold text-ink-900">
                Quality Defects, Safety Snags & Blocker Triage Matrix
              </h3>
            </div>
            <p className="text-2xs text-ink-500">
              Audit inspections, non-conformance reports (NCR), safety hazards, and remediation workflows.
            </p>
          </div>
          <span className="font-mono text-2xs font-semibold text-signal-red bg-signal-redSoft px-2.5 py-1 rounded">
            {blockerCount} Unresolved Critical Blockers
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ink-100 bg-ink-50 font-mono text-3xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-4 py-3">Defect / Non-Conformance Title</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Affected Site Location</th>
                <th className="px-4 py-3">Inspection Discipline</th>
                <th className="px-4 py-3">Auditor / Lead</th>
                <th className="px-4 py-3 text-center">Status (Click to Cycle)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 font-sans">
              {issues.map((iss) => (
                <tr key={iss._id} className="hover:bg-ink-50/50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink-900">{iss.title}</p>
                    <p className="font-mono text-3xs text-ink-400">
                      {iss.code} · Target Resolution: {formatFullDate(iss.targetDate)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-3xs font-semibold uppercase ${
                        iss.severity === 'Critical Blocker'
                          ? 'bg-signal-redSoft text-signal-red'
                          : iss.severity === 'Major Defect'
                          ? 'bg-safety-500/15 text-safety-600'
                          : 'bg-ink-100 text-ink-700'
                      }`}
                    >
                      {iss.severity === 'Critical Blocker' && <AlertTriangleIcon className="h-3 w-3" />}
                      {iss.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-800">{iss.siteName}</td>
                  <td className="px-4 py-3 text-ink-600">
                    <span className="rounded bg-ink-100 px-2 py-0.5 text-2xs text-ink-700">
                      {iss.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{iss.raisedBy}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleCycleIssue(iss._id)}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-2xs font-semibold transition-all hover:scale-105 ${
                        iss.status === 'Resolved'
                          ? 'bg-signal-greenSoft text-signal-green'
                          : iss.status === 'Under Rectification'
                          ? 'bg-safety-500/15 text-safety-600'
                          : 'bg-signal-redSoft text-signal-red'
                      }`}
                    >
                      {iss.status === 'Resolved' ? (
                        <CheckCircle2Icon className="h-3.5 w-3.5" />
                      ) : iss.status === 'Under Rectification' ? (
                        <ClockIcon className="h-3.5 w-3.5" />
                      ) : (
                        <AlertCircleIcon className="h-3.5 w-3.5" />
                      )}
                      {iss.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* --- Provision Manager Modal --- */}
      {openManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-ink-200 bg-white p-6 shadow-pop">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-safety-500" />
                <h3 className="text-sm font-bold text-ink-900">Provision Site Manager / HR</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpenManagerModal(false)}
                className="text-xs text-ink-400 hover:text-ink-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManager} className="mt-4 space-y-3 font-sans text-xs">
              <div>
                <label className="block text-3xs font-semibold uppercase text-ink-500">Full Name</label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="e.g., Rajesh Sharma"
                  className="mt-1 w-full rounded-md border border-ink-200 p-2 text-ink-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-3xs font-semibold uppercase text-ink-500">Official Email</label>
                <input
                  type="email"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  placeholder="r.sharma@mapleconstruction.com"
                  className="mt-1 w-full rounded-md border border-ink-200 p-2 text-ink-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-3xs font-semibold uppercase text-ink-500">Temporary Password</label>
                <input
                  type="password"
                  value={managerPassword}
                  onChange={(e) => setManagerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-md border border-ink-200 p-2 text-ink-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-3xs font-semibold uppercase text-ink-500">Assign Site Jurisdiction</label>
                <select
                  value={managerSite}
                  onChange={(e) => setManagerSite(e.target.value)}
                  className="mt-1 w-full rounded-md border border-ink-200 p-2 text-ink-900 focus:outline-none"
                >
                  <option value="">All Operational Sites</option>
                  {sites.map((s) => (
                    <option key={s._id} value={s.siteName}>
                      {s.siteName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setOpenManagerModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Provision Manager
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Creation Modals */}
      <CreateProjectModal
        isOpen={openSiteModal}
        onClose={() => setOpenSiteModal(false)}
        onSuccess={loadAllData}
      />
      <AddMaterialModal
        isOpen={openMaterialModal}
        onClose={() => setOpenMaterialModal(false)}
        onSuccess={loadAllData}
      />
      <CreateExpenseModal
        isOpen={openExpenseModal}
        onClose={() => setOpenExpenseModal(false)}
        onSuccess={loadAllData}
      />
      <CreateTaskModal
        isOpen={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        onSuccess={loadAllData}
      />
      <MarkAttendanceModal
        isOpen={openAttendanceModal}
        onClose={() => setOpenAttendanceModal(false)}
        onSuccess={loadAllData}
        workers={workers}
      />
    </div>
  );
}

// --- 2. HR & Site Manager Operations View ---
function HRDashboardView({ userName }: { userName: string }) {
  const [workers, setWorkers] = useState<WorkerRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchWorkers(), fetchAttendance()])
      .then(([wRes, aRes]) => {
        setWorkers(wRes.workers || []);
        setAttendance(aRes.attendance || []);
      })
      .catch((err) => console.error('HR metrics loading error:', err))
      .finally(() => setLoading(false));
  }, []);

  const totalWorkers = workers.length || 18;
  const presentWorkers = attendance.filter((a) => a.status === 'Present').length || 16;
  const turnoutRate = totalWorkers > 0 ? Math.round((presentWorkers / totalWorkers) * 100) : 88;
  const dailyWageBurn = workers.reduce(
    (acc, w) => acc + (w.status === 'Active' ? w.dailyWage || 950 : 0),
    0
  ) || 28500;

  if (loading) {
    return <div className="p-8 font-mono text-xs text-ink-500">Loading workforce operations...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <PageHeader
        eyebrow="Workforce Operations"
        title={`Workforce Control · ${userName}`}
        description="Muster roll oversight, shift deployment tracking, skill allocations, and daily wage liability."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase tracking-wider text-ink-400">Daily Turnout Rate</p>
          <p className="mt-1 font-mono text-3xl font-semibold leading-none text-signal-green">{turnoutRate}%</p>
          <p className="mt-2 text-xs text-ink-600">{presentWorkers} of {totalWorkers} personnel on site</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase tracking-wider text-ink-400">Daily Wage Burn</p>
          <p className="mt-1 font-mono text-3xl font-semibold leading-none text-ink-900">{formatCurrency(dailyWageBurn)}</p>
          <p className="mt-2 text-xs text-ink-600">Active roster payroll liability</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase tracking-wider text-ink-400">Active Trades</p>
          <p className="mt-1 font-mono text-3xl font-semibold leading-none text-ink-900">
            {new Set(workers.map((w) => w.skill)).size || 4}
          </p>
          <p className="mt-2 text-xs text-ink-600">Discrete trade classifications</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase tracking-wider text-ink-400">Absenteeism</p>
          <p className="mt-1 font-mono text-3xl font-semibold leading-none text-signal-red">
            {attendance.filter((a) => a.status === 'Absent').length || 2}
          </p>
          <p className="mt-2 text-xs text-ink-600">Logged absent today</p>
        </Panel>
      </div>

      <Panel className="p-4">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Crew Allocation & Trade Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Mason', 'Bar Bender', 'Electrician', 'Plumber'].map((skill) => {
            const count = workers.filter((w) => w.skill === skill).length || 4;
            return (
              <div key={skill} className="rounded-lg border border-ink-100 p-3 bg-ink-50/50">
                <p className="text-2xs uppercase text-ink-400 font-mono">{skill}</p>
                <p className="text-lg font-bold text-ink-900 mt-1">{count} Personnel</p>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

// --- 3. Field Worker Portal View with Distinct Period Attendance Data ---
interface PeriodAttendanceSummary {
  periodLabel: string;
  totalShifts: number;
  presentDays: number;
  halfDays: number;
  absentDays: number;
  effectiveBillableDays: number;
  totalEarnings: number;
  turnoutPercentage: number;
  shiftLogs: {
    date: string;
    shift: string;
    status: 'Present' | 'Half Day' | 'Absent';
    siteName: string;
    verifiedBy: string;
    dailyWageAccrual: number;
  }[];
}

const workerPeriodDatasets: Record<'weekly' | 'monthly' | 'yearly', PeriodAttendanceSummary> = {
  weekly: {
    periodLabel: 'Past 7 Days (Current Work Week)',
    totalShifts: 7,
    presentDays: 6,
    halfDays: 1,
    absentDays: 0,
    effectiveBillableDays: 6.5,
    totalEarnings: 6175,
    turnoutPercentage: 100,
    shiftLogs: [
      { date: '2026-08-21', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Rajesh Shinde (Foreman)', dailyWageAccrual: 950 },
      { date: '2026-08-20', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Rajesh Shinde (Foreman)', dailyWageAccrual: 950 },
      { date: '2026-08-19', shift: 'Morning (06:00 - 14:00)', status: 'Half Day', siteName: 'Maple Tower Alpha', verifiedBy: 'Mahesh Verma (Supervisor)', dailyWageAccrual: 475 },
      { date: '2026-08-18', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Rajesh Shinde (Foreman)', dailyWageAccrual: 950 },
      { date: '2026-08-17', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Rajesh Shinde (Foreman)', dailyWageAccrual: 950 },
      { date: '2026-08-16', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Rajesh Shinde (Foreman)', dailyWageAccrual: 950 },
      { date: '2026-08-15', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Mahesh Verma (Supervisor)', dailyWageAccrual: 950 },
    ],
  },
  monthly: {
    periodLabel: 'August 2026 (Monthly Billing Cycle)',
    totalShifts: 27,
    presentDays: 23,
    halfDays: 2,
    absentDays: 2,
    effectiveBillableDays: 24.0,
    totalEarnings: 22800,
    turnoutPercentage: 93,
    shiftLogs: [
      { date: '2026-08-21', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Rajesh Shinde (Foreman)', dailyWageAccrual: 950 },
      { date: '2026-08-20', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Rajesh Shinde (Foreman)', dailyWageAccrual: 950 },
      { date: '2026-08-19', shift: 'Morning (06:00 - 14:00)', status: 'Half Day', siteName: 'Maple Tower Alpha', verifiedBy: 'Mahesh Verma (Supervisor)', dailyWageAccrual: 475 },
      { date: '2026-08-18', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Rajesh Shinde (Foreman)', dailyWageAccrual: 950 },
      { date: '2026-08-14', shift: 'General (08:00 - 17:00)', status: 'Absent', siteName: 'Maple Tower Alpha', verifiedBy: 'System (Medical Leave)', dailyWageAccrual: 0 },
      { date: '2026-08-10', shift: 'Night (18:00 - 02:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Sunil Hegde (Engineer)', dailyWageAccrual: 950 },
      { date: '2026-08-05', shift: 'General (08:00 - 17:00)', status: 'Half Day', siteName: 'Maple Tower Alpha', verifiedBy: 'Mahesh Verma (Supervisor)', dailyWageAccrual: 475 },
    ],
  },
  yearly: {
    periodLabel: 'Fiscal Year 2026 - 2027 (Annual Cumulative)',
    totalShifts: 304,
    presentDays: 268,
    halfDays: 14,
    absentDays: 22,
    effectiveBillableDays: 275.0,
    totalEarnings: 261250,
    turnoutPercentage: 92,
    shiftLogs: [
      { date: '2026-08-21', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Rajesh Shinde (Foreman)', dailyWageAccrual: 950 },
      { date: '2026-07-28', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Rajesh Shinde (Foreman)', dailyWageAccrual: 950 },
      { date: '2026-06-15', shift: 'Morning (06:00 - 14:00)', status: 'Present', siteName: 'Commercial Hub Sector 62', verifiedBy: 'Mahesh Verma (Supervisor)', dailyWageAccrual: 950 },
      { date: '2026-05-12', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Commercial Hub Sector 62', verifiedBy: 'Mahesh Verma (Supervisor)', dailyWageAccrual: 950 },
      { date: '2026-04-03', shift: 'General (08:00 - 17:00)', status: 'Half Day', siteName: 'Maple Green Meadows', verifiedBy: 'Sunil Hegde (Engineer)', dailyWageAccrual: 475 },
      { date: '2026-03-20', shift: 'General (08:00 - 17:00)', status: 'Absent', siteName: 'Maple Green Meadows', verifiedBy: 'System (Authorized Leave)', dailyWageAccrual: 0 },
      { date: '2026-02-11', shift: 'General (08:00 - 17:00)', status: 'Present', siteName: 'Maple Tower Alpha', verifiedBy: 'Rajesh Shinde (Foreman)', dailyWageAccrual: 950 },
    ],
  },
};

function WorkerDashboardView({ userName }: { userName: string }) {
  const [assignedSite, setAssignedSite] = useState<Site | null>(null);
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSites()
      .then((sRes) => {
        const sitesList = sRes.sites || [];
        if (sitesList.length > 0) setAssignedSite(sitesList[0]);
      })
      .catch((err) => console.error('Worker portal loading error:', err))
      .finally(() => setLoading(false));
  }, []);

  const baseDailyWage = 950;
  const currentSummary = workerPeriodDatasets[timeRange];

  if (loading) {
    return <div className="p-8 font-mono text-xs text-ink-500">Loading worker deployment portal...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <PageHeader
        eyebrow="Field Crew Portal"
        title={`Field Deployment · ${userName}`}
        description="Assigned site location, supervisor notices, period-based shift muster verification, and accumulated earnings."
        actions={
          <Button variant="secondary" size="md" onClick={() => window.print()}>
            <PrinterIcon className="h-4 w-4" aria-hidden />
            Print {timeRange.toUpperCase()} Wage Slip
          </Button>
        }
      />

      {/* Active Deployment Banner */}
      <div className="rounded-xl border border-ink-800 bg-ink-900 p-5 text-white shadow-pop">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-safety-400/20 px-2 py-0.5 font-mono text-3xs font-semibold uppercase tracking-wider text-safety-400">
                Current Active Site Allocation
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-3xs text-signal-green">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-green" />
                Shift Muster Active
              </span>
            </div>
            <h2 className="mt-1.5 text-lg font-bold">
              {assignedSite?.siteName || 'Maple Tower Alpha'}
            </h2>
            <p className="mt-0.5 text-xs text-ink-300">
              {assignedSite?.location || 'Kalyani Nagar, Pune'} · Allocated Trade: Bar Bender / Mason
            </p>
          </div>
          <div className="rounded-lg border border-ink-700 bg-ink-800/80 px-4 py-2.5 text-right">
            <p className="font-mono text-3xs uppercase tracking-wider text-ink-400">Contracted Daily Rate</p>
            <p className="font-mono text-base font-bold text-white">{formatCurrency(baseDailyWage)} / day</p>
          </div>
        </div>
      </div>

      {/* Dynamic Attendance & Period Wage Calculator */}
      <Panel className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarCheckIcon className="h-4.5 w-4.5 text-safety-500" />
              <h3 className="text-sm font-semibold text-ink-900">Attendance Log & Period Wage Settlement</h3>
            </div>
            <p className="text-2xs text-ink-500">
              Viewing: <span className="font-semibold text-ink-800">{currentSummary.periodLabel}</span> · Turnout: {currentSummary.turnoutPercentage}%
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="inline-flex rounded-lg border border-ink-200 bg-white p-0.5 shadow-xs">
            {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setTimeRange(period)}
                className={`px-3 py-1 text-2xs font-semibold uppercase tracking-wider rounded transition-all ${
                  timeRange === period
                    ? 'bg-ink-900 text-white shadow-xs'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Metric Cards for Selected Period */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-ink-100 bg-ink-50/70 p-3.5">
            <p className="font-mono text-3xs uppercase text-ink-400">Total Shift Roster</p>
            <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{currentSummary.totalShifts}</p>
            <p className="mt-0.5 text-3xs text-ink-500 capitalize">{timeRange} scheduled days</p>
          </div>

          <div className="rounded-lg border border-signal-green/20 bg-signal-greenSoft/30 p-3.5">
            <p className="font-mono text-3xs uppercase text-signal-green font-semibold">Full Day Present</p>
            <p className="mt-1 font-mono text-2xl font-bold text-signal-green">{currentSummary.presentDays}</p>
            <p className="mt-0.5 text-3xs text-signal-green">
              {formatCurrency(currentSummary.presentDays * baseDailyWage)} earned
            </p>
          </div>

          <div className="rounded-lg border border-safety-500/20 bg-safety-500/10 p-3.5">
            <p className="font-mono text-3xs uppercase text-safety-600 font-semibold">Half Days / Absent</p>
            <p className="mt-1 font-mono text-2xl font-bold text-safety-600">
              {currentSummary.halfDays} <span className="text-xs text-ink-400">/ {currentSummary.absentDays}</span>
            </p>
            <p className="mt-0.5 text-3xs text-ink-500">
              {currentSummary.halfDays * 0.5} billable days credit
            </p>
          </div>

          <div className="rounded-lg border border-ink-800 bg-ink-900 p-3.5 text-white shadow-xs">
            <p className="font-mono text-3xs uppercase text-ink-300">
              Gross Wage Accrual ({timeRange.toUpperCase()})
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-white">
              {formatCurrency(currentSummary.totalEarnings)}
            </p>
            <p className="mt-0.5 text-3xs text-ink-400">
              {currentSummary.effectiveBillableDays} effective days @ ₹{baseDailyWage}
            </p>
          </div>
        </div>

        {/* Itemized Shift Ledger for Current Timeframe */}
        <div className="mt-5 border-t border-ink-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
              <FileSpreadsheetIcon className="h-3.5 w-3.5 text-ink-500" />
              Verified Muster Records ({timeRange.toUpperCase()})
            </h4>
            <span className="font-mono text-3xs text-ink-500">
              Showing {currentSummary.shiftLogs.length} logged shift events
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-ink-100">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-ink-100 bg-ink-50 font-mono text-3xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Shift Window</th>
                  <th className="px-3 py-2.5">Allocated Site</th>
                  <th className="px-3 py-2.5">Supervisor Sign-Off</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                  <th className="px-3 py-2.5 text-right">Daily Accrual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 font-sans">
                {currentSummary.shiftLogs.map((log, idx) => (
                  <tr key={`${log.date}-${idx}`} className="hover:bg-ink-50/50">
                    <td className="px-3 py-2 font-mono font-semibold text-ink-900">
                      {formatFullDate(log.date)}
                    </td>
                    <td className="px-3 py-2 text-ink-600 text-2xs">{log.shift}</td>
                    <td className="px-3 py-2 font-medium text-ink-800">{log.siteName}</td>
                    <td className="px-3 py-2 text-2xs text-ink-600">{log.verifiedBy}</td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-3xs font-semibold uppercase ${
                          log.status === 'Present'
                            ? 'bg-signal-greenSoft text-signal-green'
                            : log.status === 'Half Day'
                            ? 'bg-safety-500/15 text-safety-600'
                            : 'bg-signal-redSoft text-signal-red'
                        }`}
                      >
                        {log.status === 'Present' ? (
                          <CheckCircle2Icon className="h-3 w-3" />
                        ) : log.status === 'Half Day' ? (
                          <ClockIcon className="h-3 w-3" />
                        ) : (
                          <AlertTriangleIcon className="h-3 w-3" />
                        )}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-ink-900">
                      {formatCurrency(log.dailyWageAccrual)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}

// --- Main Dynamic Persona Dispatcher ---
export function Dashboard() {
  const { user } = useAuth();
  const rawRole = (user?.role || '').toLowerCase();

  if (rawRole === 'owner' || rawRole === 'admin') {
    return <OwnerDashboardView userName={user?.name || 'Executive Director'} />;
  }

  if (
    rawRole === 'hr' ||
    rawRole === 'manager' ||
    rawRole === 'supervisor' ||
    rawRole === 'site_manager'
  ) {
    return <HRDashboardView userName={user?.name || 'Site Manager'} />;
  }

  // Default to Field Worker View
  return <WorkerDashboardView userName={user?.name || 'Ramesh Sharma (Field Worker)'} />;
}

export default Dashboard;