import { useEffect, useState } from 'react';
import { Panel } from '../ui/Panel';
import { PageHeader } from '../ui/PageHeader';
import { getTasks, Task } from '../../services/taskService';
import { fetchAttendance, AttendanceRecord } from '../../services/labourService';
import { useAuth } from '../../context/AuthContext';
import { formatFullDate, formatCurrency } from '../../utils/format';

export function WorkerDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTasks(), fetchAttendance()])
      .then(([tRes, aRes]) => {
        setTasks(tRes.tasks || []);
        setAttendance(aRes.attendance || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const daysPresent = attendance.filter((a) => a.status === 'Present').length;
  const estimatedEarnings = daysPresent * 950; // Average daily rate base

  if (loading) return <div className="p-8 font-mono text-xs text-ink-500">Loading Personal Portal...</div>;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <PageHeader
        eyebrow="Field Crew Portal"
        title={`Welcome, ${user?.name || 'Worker'}`}
        description="View your assigned site deliverables, logged shift records, and estimated wage earnings."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Assigned Tasks</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{tasks.length}</p>
          <p className="mt-1 text-2xs text-ink-500">Active Work Items</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Days Logged Present</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-green">{daysPresent}</p>
          <p className="mt-1 text-2xs text-ink-500">Current Month</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Estimated Accumulated Wages</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{formatCurrency(estimatedEarnings)}</p>
          <p className="mt-1 text-2xs text-ink-500">Pending Pay Cycle</p>
        </Panel>
      </div>

      <Panel className="p-4">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Your Work Assignments</h3>
        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t._id} className="flex items-center justify-between p-3 rounded-lg border border-ink-100 bg-white">
              <div>
                <p className="text-xs font-semibold text-ink-900">{t.title}</p>
                <p className="text-2xs text-ink-500">Due: {t.dueDate ? formatFullDate(t.dueDate) : 'No fixed date'}</p>
              </div>
              <span className="text-2xs font-semibold uppercase px-2 py-0.5 rounded bg-ink-100 text-ink-700">
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}