import { useEffect, useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  CheckCircle2Icon,
  ClockIcon,
  AlertCircleIcon,
  CalendarIcon,
  UserCheckIcon,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { getTasks, updateTaskStatus, Task } from '../services/taskService';
import { formatFullDate } from '../utils/format';

const defaultMockTasks: Task[] = [
  {
    _id: 'tsk-101',
    title: 'Reinforcement Steel Binding - Pier P12',
    description: 'Ensure spacing complies with drawing REV-C specification.',
    status: 'In Progress',
    priority: 'High',
    site: 'Maple Tower Alpha',
    assignedTo: { _id: 'w1', fullName: 'Ramesh Sharma' },
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
  },
  {
    _id: 'tsk-102',
    title: 'Ready-Mix Concrete Pouring (Grade M30)',
    description: 'Pour 24 cubic meters for basement slab B2 at Grid 4-E.',
    status: 'Pending',
    priority: 'Critical',
    site: 'Maple Tower Alpha',
    assignedTo: { _id: 'w2', fullName: 'Anil Jadhav' },
    dueDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    _id: 'tsk-103',
    title: 'Electrical Conduit Embedding in 4th Floor Slab',
    description: 'Lay PVC heavy-duty conduit lines prior to shuttering inspection.',
    status: 'Completed',
    priority: 'Medium',
    site: 'Commercial Hub Sector 62',
    assignedTo: { _id: 'w3', fullName: 'Suresh Verma' },
    dueDate: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'tsk-104',
    title: 'Plumbing Core Cutting & Sleeve Fixing',
    description: 'Core drilling 110mm drainage sleeves across shafts S1 and S2.',
    status: 'In Progress',
    priority: 'Medium',
    site: 'Commercial Hub Sector 62',
    assignedTo: { _id: 'w4', fullName: 'Dinesh Kumar' },
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
  },
  {
    _id: 'tsk-105',
    title: 'Shuttering De-molding & Curing Compound Spray',
    description: 'Strip column forms C1-C8 and apply membrane curing chemical.',
    status: 'Pending',
    priority: 'Low',
    site: 'Maple Green Meadows',
    assignedTo: { _id: 'w5', fullName: 'Santosh Shinde' },
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
  },
];

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      if (res.tasks && res.tasks.length > 0) {
        setTasks(res.tasks);
      } else {
        setTasks(defaultMockTasks);
      }
    } catch {
      setTasks(defaultMockTasks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCycleStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === 'Pending'
        ? 'In Progress'
        : currentStatus === 'In Progress'
        ? 'Completed'
        : 'Pending';

    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: nextStatus } : t))
    );

    try {
      await updateTaskStatus(taskId, nextStatus);
    } catch {
      // Retain optimistic UI state
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <PageHeader
        eyebrow="Execution & Milestones"
        title="Site Task Management"
        description="Assign work packages, monitor field progress, and verify subcontractor milestones."
        actions={
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-4 w-4" aria-hidden />
            New Task
          </Button>
        }
      />

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Total Work Packages</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{tasks.length}</p>
          <p className="mt-1 text-2xs text-ink-500">Across all active sites</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Pending Execution</p>
          <p className="mt-1 font-mono text-2xl font-bold text-safety-500">{pendingCount}</p>
          <p className="mt-1 text-2xs text-ink-500">Awaiting labor deployment</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">In Active Progress</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-blue">{inProgressCount}</p>
          <p className="mt-1 text-2xs text-ink-500">Field work underway</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Completed & Verified</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-green">{completedCount}</p>
          <p className="mt-1 text-2xs text-ink-500">Quality sign-off logged</p>
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
            placeholder="Search work packages, notes..."
            className="w-full rounded-md border border-ink-200 bg-white py-2 pl-9 pr-3 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
          />
        </div>

        <div className="inline-flex rounded-lg border border-ink-200 bg-white p-0.5 shadow-xs">
          {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((tab) => (
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

      {/* Task Master Table */}
      <Panel className="overflow-hidden p-0 shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ink-100 bg-ink-50 font-mono text-3xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-4 py-3">Task Deliverable</th>
                <th className="px-4 py-3">Assigned Crew</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Target Due Date</th>
                <th className="px-4 py-3 text-center">Status (Click to Cycle)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center font-mono text-xs text-ink-400">
                    Loading task registry...
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => {
                  const assignedName =
                    typeof t.assignedTo === 'object' && t.assignedTo !== null
                      ? t.assignedTo.fullName
                      : typeof t.assignedTo === 'string'
                      ? t.assignedTo
                      : 'Field Crew';

                  return (
                    <tr key={t._id} className="hover:bg-ink-50/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-ink-900">{t.title}</p>
                        <p className="mt-0.5 text-2xs text-ink-500 line-clamp-1">{t.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-ink-800">
                          <UserCheckIcon className="h-3.5 w-3.5 text-ink-400" />
                          <span className="font-medium">{assignedName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 font-mono text-3xs font-semibold uppercase ${
                            t.priority === 'Critical'
                              ? 'bg-signal-redSoft text-signal-red'
                              : t.priority === 'High'
                              ? 'bg-safety-500/15 text-safety-600'
                              : 'bg-ink-100 text-ink-700'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-2xs text-ink-600">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3.5 w-3.5 text-ink-400" />
                          {t.dueDate ? formatFullDate(t.dueDate) : 'Open Timeline'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleCycleStatus(t._id, t.status)}
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-2xs font-semibold transition-all hover:scale-105 ${
                            t.status === 'Completed'
                              ? 'bg-signal-greenSoft text-signal-green'
                              : t.status === 'In Progress'
                              ? 'bg-signal-blueSoft text-signal-blue'
                              : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                          }`}
                        >
                          {t.status === 'Completed' ? (
                            <CheckCircle2Icon className="h-3.5 w-3.5" />
                          ) : t.status === 'In Progress' ? (
                            <ClockIcon className="h-3.5 w-3.5" />
                          ) : (
                            <AlertCircleIcon className="h-3.5 w-3.5" />
                          )}
                          {t.status}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}

              {!loading && filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-xs text-ink-500">
                    No work packages matched your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadTasks}
      />
    </div>
  );
}

export default Tasks;