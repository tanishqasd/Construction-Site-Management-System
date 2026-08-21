import { useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { formatFullDate } from '../utils/format';

export interface QualityIssue {
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

const defaultMockIssues: QualityIssue[] = [
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

export function Issues() {
  const [issues, setIssues] = useState<QualityIssue[]>(defaultMockIssues);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const handleCycleStatus = (issueId: string) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item._id === issueId) {
          const nextStatus: QualityIssue['status'] =
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

  const blockerCount = issues.filter(
    (i) => i.severity === 'Critical Blocker' && i.status !== 'Resolved'
  ).length;
  const majorCount = issues.filter(
    (i) => i.severity === 'Major Defect' && i.status !== 'Resolved'
  ).length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  const filteredIssues = issues.filter((iss) => {
    const matchesSearch =
      iss.title.toLowerCase().includes(search.toLowerCase()) ||
      iss.code.toLowerCase().includes(search.toLowerCase()) ||
      iss.siteName.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || iss.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || iss.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <PageHeader
        eyebrow="Quality Assurance & EHS Compliance"
        title="Defects & Non-Conformance Triage"
        description="Log site audit snags, safety non-conformance reports (NCR), material rejections, and verify remediation sign-offs."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => alert('New defect incident modal opened')}
          >
            <PlusIcon className="h-4 w-4" aria-hidden />
            Raise Snag / NCR
          </Button>
        }
      />

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Total Tracked Snags</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{issues.length}</p>
          <p className="mt-1 text-2xs text-ink-500">Across all site inspections</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Critical Blockers</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-red">{blockerCount}</p>
          <p className="mt-1 text-2xs text-signal-red font-semibold">Immediate stop-work hazards</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Major Defects</p>
          <p className="mt-1 font-mono text-2xl font-bold text-safety-600">{majorCount}</p>
          <p className="mt-1 text-2xs text-ink-500">Targeted for shift rectification</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Resolved & Closed</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-green">{resolvedCount}</p>
          <p className="mt-1 text-2xs text-ink-500">Signed off by auditor</p>
        </Panel>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search defect code, location, or title..."
            className="w-full rounded-md border border-ink-200 bg-white py-2 pl-9 pr-3 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded border border-ink-200 bg-white px-3 py-1 text-2xs font-semibold text-ink-700"
          >
            <option value="All">All Severities</option>
            <option value="Critical Blocker">Critical Blocker</option>
            <option value="Major Defect">Major Defect</option>
            <option value="Minor Snag">Minor Snag</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-ink-200 bg-white px-3 py-1 text-2xs font-semibold text-ink-700"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Rectification">Under Rectification</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Issues Master Table */}
      <Panel className="overflow-hidden p-0 shadow-panel">
        <div className="overflow-x-auto">
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
              {filteredIssues.map((iss) => (
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
                      onClick={() => handleCycleStatus(iss._id)}
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
    </div>
  );
}

export default Issues;