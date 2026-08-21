import { useEffect, useState } from 'react';
import { Panel } from '../ui/Panel';
import { PageHeader } from '../ui/PageHeader';
import { getSites, Site } from '../../services/siteService';
import { fetchExpenses, ExpenseRecord } from '../../services/expenseService';
import { fetchIssues, IssueItem } from '../../services/issueService';
import { formatCurrency } from '../../utils/format';

export function OwnerDashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSites(), fetchExpenses(), fetchIssues()])
      .then(([sRes, eRes, iRes]) => {
        setSites(sRes.sites || []);
        setExpenses(eRes.expenses || []);
        setIssues(iRes.issues || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalBudget = sites.reduce((sum, s) => sum + (s.budget || 0), 0);
  const totalBurn = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const criticalBlockers = issues.filter((i) => i.severity === 'Critical' && i.status !== 'Resolved').length;

  if (loading) return <div className="p-8 font-mono text-xs text-ink-500">Loading Executive Overview...</div>;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <PageHeader
        eyebrow="Executive Portfolio"
        title="Owner's Capital & Project Dashboard"
        description="High-level fiscal tracking, portfolio risk assessment, and site milestone oversight."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Total Contract Value</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{formatCurrency(totalBudget)}</p>
          <p className="mt-1 text-2xs text-ink-500">{sites.length} Active Sites</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Total Capital Burn</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{formatCurrency(totalBurn)}</p>
          <p className="mt-1 text-2xs text-ink-500">{totalBudget > 0 ? Math.round((totalBurn / totalBudget) * 100) : 0}% Budget Consumed</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Critical Project Blockers</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-red">{criticalBlockers}</p>
          <p className="mt-1 text-2xs text-ink-500">Requiring Executive Escalation</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Active Sites</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-green">
            {sites.filter((s) => s.status === 'Ongoing').length}
          </p>
          <p className="mt-1 text-2xs text-ink-500">In Construction Phase</p>
        </Panel>
      </div>

      <Panel className="p-4">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Project Portfolio Status</h3>
        <div className="divide-y divide-ink-100">
          {sites.map((site) => (
            <div key={site._id} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-ink-900">{site.siteName}</p>
                <p className="text-2xs text-ink-500">{site.location} • {site.clientName}</p>
              </div>
              <div className="text-right font-mono text-xs">
                <p className="font-semibold text-ink-900">{formatCurrency(site.budget)}</p>
                <span className="text-2xs uppercase font-medium text-signal-green">{site.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}