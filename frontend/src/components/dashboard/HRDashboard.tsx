import { useEffect, useState } from 'react';
import { Panel } from '../ui/Panel';
import { PageHeader } from '../ui/PageHeader';
import { fetchWorkers, fetchAttendance, WorkerRecord, AttendanceRecord } from '../../services/labourService';
import { formatCurrency } from '../../utils/format';

export function HRDashboard() {
  const [workers, setWorkers] = useState<WorkerRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchWorkers(), fetchAttendance()])
      .then(([wRes, aRes]) => {
        setWorkers(wRes.workers || []);
        setAttendance(aRes.attendance || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalWorkers = workers.length;
  const presentWorkers = attendance.filter((a) => a.status === 'Present').length;
  const turnoutRate = totalWorkers > 0 ? Math.round((presentWorkers / totalWorkers) * 100) : 0;
  const dailyWageBurn = workers.reduce((acc, w) => acc + (w.status === 'Active' ? w.dailyWage : 0), 0);

  if (loading) return <div className="p-8 font-mono text-xs text-ink-500">Loading Workforce Operations...</div>;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <PageHeader
        eyebrow="Workforce Operations"
        title="HR & Site Manager Operations"
        description="Muster roll management, shift deployment, skill allocations, and daily wage liability."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Daily Turnout Rate</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-green">{turnoutRate}%</p>
          <p className="mt-1 text-2xs text-ink-500">{presentWorkers} of {totalWorkers} on site</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Daily Wage Burn</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{formatCurrency(dailyWageBurn)}</p>
          <p className="mt-1 text-2xs text-ink-500">Active Roster Payroll</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Active Trades</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">
            {new Set(workers.map((w) => w.skill)).size}
          </p>
          <p className="mt-1 text-2xs text-ink-500">Skill Categories</p>
        </Panel>

        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Absenteeism</p>
          <p className="mt-1 font-mono text-2xl font-bold text-signal-red">
            {attendance.filter((a) => a.status === 'Absent').length}
          </p>
          <p className="mt-1 text-2xs text-ink-500">Logged Absent Today</p>
        </Panel>
      </div>

      <Panel className="p-4">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Crew Allocation & Trade Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from(new Set(workers.map((w) => w.skill))).map((skill) => {
            const count = workers.filter((w) => w.skill === skill).length;
            return (
              <div key={skill} className="rounded-lg border border-ink-100 p-3 bg-ink-50/50">
                <p className="text-2xs uppercase text-ink-400 font-mono">{skill}</p>
                <p className="text-lg font-bold text-ink-900 mt-1">{count} Workers</p>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}