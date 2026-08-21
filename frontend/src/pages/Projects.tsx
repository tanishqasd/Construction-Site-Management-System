import { useEffect, useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  MapPinIcon,
  CheckCircle2Icon,
  ClockIcon,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { getSites, Site } from '../services/siteService';
import { formatCurrency } from '../utils/format';

interface ProjectDisplayRecord {
  _id: string;
  siteName: string;
  location: string;
  client: string;
  budget: number;
  spent: number;
  progressPercentage: number;
  status: 'Ongoing' | 'Completed' | 'Delayed' | 'Planning';
  targetDate: string;
  engineer: string;
  activeLabor: number;
}

const defaultMockProjects: ProjectDisplayRecord[] = [
  {
    _id: 's1',
    siteName: 'Maple Tower Alpha',
    location: 'Kalyani Nagar, Pune, Maharashtra',
    client: 'Aurum Realty Developers Ltd.',
    budget: 15000000,
    spent: 9850000,
    progressPercentage: 68,
    status: 'Ongoing',
    targetDate: new Date(Date.now() + 86400000 * 180).toISOString(),
    engineer: 'Rajesh Sharma (Project Lead)',
    activeLabor: 42,
  },
  {
    _id: 's2',
    siteName: 'Commercial Hub Sector 62',
    location: 'Sector 62, Noida, NCR',
    client: 'Apex Infrastructure & Tech Parks',
    budget: 28000000,
    spent: 11760000,
    progressPercentage: 42,
    status: 'Ongoing',
    targetDate: new Date(Date.now() + 86400000 * 240).toISOString(),
    engineer: 'Mahesh Verma (Site Manager)',
    activeLabor: 28,
  },
  {
    _id: 's3',
    siteName: 'Maple Green Meadows',
    location: 'Whitefield, Bangalore, Karnataka',
    client: 'Greenfield Luxury Estates',
    budget: 8500000,
    spent: 8420000,
    progressPercentage: 100,
    status: 'Completed',
    targetDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    engineer: 'Sunil Hegde (Senior Engineer)',
    activeLabor: 16,
  },
];

export function Projects() {
  const [projects, setProjects] = useState<ProjectDisplayRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await getSites();
      if (res.sites && res.sites.length > 0) {
        const mapped: ProjectDisplayRecord[] = res.sites.map((s: Site, idx: number) => {
          const fallback = defaultMockProjects[idx % defaultMockProjects.length];
          const raw = s as unknown as Record<string, unknown>;
          return {
            _id: s._id,
            siteName: s.siteName || fallback.siteName,
            location: s.location || fallback.location,
            client: typeof raw.client === 'string' ? raw.client : fallback.client,
            budget: s.budget || fallback.budget,
            spent: typeof raw.spent === 'number' ? raw.spent : Math.round((s.budget || fallback.budget) * 0.6),
            progressPercentage:
              typeof raw.progressPercentage === 'number'
                ? raw.progressPercentage
                : fallback.progressPercentage,
            status:
              raw.status === 'Ongoing' || raw.status === 'Completed' || raw.status === 'Delayed' || raw.status === 'Planning'
                ? raw.status
                : fallback.status,
            targetDate: typeof raw.targetDate === 'string' ? raw.targetDate : fallback.targetDate,
            engineer: typeof raw.engineer === 'string' ? raw.engineer : fallback.engineer,
            activeLabor: typeof raw.activeLabor === 'number' ? raw.activeLabor : fallback.activeLabor,
          };
        });
        setProjects(mapped);
      } else {
        setProjects(defaultMockProjects);
      }
    } catch {
      setProjects(defaultMockProjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const totalPortfolioBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalCapitalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
  const ongoingProjects = projects.filter((p) => p.status === 'Ongoing').length;
  const totalActiveWorkers = projects.reduce((acc, p) => acc + (p.activeLabor || 0), 0);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.siteName.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <PageHeader
        eyebrow="Portfolio & Project Governance"
        title="Active Sites & Capital Projects"
        description="Comprehensive project charters, physical milestone completion, capital expenditure tracking, and site management oversight."
        actions={
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-4 w-4" aria-hidden />
            Create Project Site
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Total Portfolio Value</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{formatCurrency(totalPortfolioBudget)}</p>
          <p className="mt-1 text-2xs text-ink-500">Across all {projects.length} project charters</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Disbursed Capital (Burn)</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-red">{formatCurrency(totalCapitalSpent)}</p>
          <p className="mt-1 text-2xs text-ink-500">
            {totalPortfolioBudget > 0 ? Math.round((totalCapitalSpent / totalPortfolioBudget) * 100) : 0}% of total budget
          </p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Ongoing Projects</p>
          <p className="mt-1 font-mono text-2xl font-bold text-safety-500">{ongoingProjects}</p>
          <p className="mt-1 text-2xs text-ink-500">Under active civil execution</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Total Deployed Labour</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-green">{totalActiveWorkers}</p>
          <p className="mt-1 text-2xs text-ink-500">Active personnel across all sites</p>
        </Panel>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project site, location, client..."
            className="w-full rounded-md border border-ink-200 bg-white py-2 pl-9 pr-3 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
          />
        </div>

        <div className="inline-flex rounded-lg border border-ink-200 bg-white p-0.5 shadow-xs">
          {(['All', 'Ongoing', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded px-3 py-1 text-2xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === tab
                  ? 'bg-ink-900 text-white shadow-xs'
                  : 'text-ink-600 hover:bg-ink-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center font-mono text-xs text-ink-400">
            Loading project charters...
          </div>
        ) : (
          filteredProjects.map((p) => {
            const isCompleted = p.status === 'Completed';
            return (
              <Panel key={p._id} className="flex flex-col justify-between p-5 transition-shadow hover:shadow-pop">
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-ink-100 pb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-sm font-bold text-ink-900">{p.siteName}</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-2xs text-ink-500">
                        <MapPinIcon className="h-3 w-3 shrink-0 text-ink-400" />
                        <span className="truncate">{p.location}</span>
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-3xs font-semibold uppercase ${
                        isCompleted
                          ? 'bg-signal-greenSoft text-signal-green'
                          : 'bg-safety-500/15 text-safety-600'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2Icon className="h-3 w-3" /> : <ClockIcon className="h-3 w-3" />}
                      {p.status}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-1.5 text-2xs">
                    <div className="flex justify-between">
                      <span className="text-ink-500">Client / Developer:</span>
                      <span className="font-medium text-ink-900">{p.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-500">Site Engineer:</span>
                      <span className="font-medium text-ink-900">{p.engineer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-500">Active Crew Deployed:</span>
                      <span className="font-mono font-semibold text-ink-900">{p.activeLabor} Personnel</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-ink-50 p-3">
                    <div className="flex justify-between font-mono text-3xs mb-1">
                      <span className="text-ink-500">Milestone Progress</span>
                      <span className="font-bold text-ink-900">{p.progressPercentage}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-ink-200">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCompleted ? 'bg-signal-green' : 'bg-safety-400'
                        }`}
                        style={{ width: `${p.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3 text-xs">
                  <div>
                    <p className="font-mono text-3xs uppercase text-ink-400">Total Budget</p>
                    <p className="font-mono text-xs font-bold text-ink-900">{formatCurrency(p.budget)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-3xs uppercase text-ink-400">Disbursed Cost</p>
                    <p className="font-mono text-xs font-bold text-signal-red">{formatCurrency(p.spent)}</p>
                  </div>
                </div>
              </Panel>
            );
          })
        )}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadProjects}
      />
    </div>
  );
}

export default Projects;