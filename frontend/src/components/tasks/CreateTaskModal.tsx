import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { createTask, Task } from '../../services/taskService';
import { getSites, Site } from '../../services/siteService';
import { fetchWorkers, WorkerRecord } from '../../services/labourService';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTask: Task) => void;
}

export function CreateTaskModal({ isOpen, onClose, onSuccess }: CreateTaskModalProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [workers, setWorkers] = useState<WorkerRecord[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    site: '',
    assignedTo: '',
    priority: 'Medium' as Task['priority'],
    dueDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      Promise.all([getSites(), fetchWorkers()])
        .then(([siteRes, workerRes]) => {
          const siteList = siteRes.sites || [];
          const workerList = workerRes.workers || [];
          setSites(siteList);
          setWorkers(workerList);
          if (siteList.length > 0) {
            setFormData((prev) => (prev.site ? prev : { ...prev, site: siteList[0]._id }));
          }
        })
        .catch((err) => console.error('Failed to load project references:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.site) {
      setError('Please select an active project site.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await createTask({
        title: formData.title,
        description: formData.description,
        site: formData.site,
        assignedTo: formData.assignedTo || undefined,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      });

      const targetSite = sites.find((s) => s._id === formData.site);
      const targetWorker = workers.find((w) => w._id === formData.assignedTo);

      const augmentedTask: Task = {
        ...response.task,
        site: {
          _id: formData.site,
          siteName: targetSite?.siteName || 'Project Site',
        },
        assignedTo: targetWorker
          ? { _id: targetWorker._id, fullName: targetWorker.fullName }
          : undefined,
      };

      onSuccess(augmentedTask);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create task.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl border border-ink-200 bg-white p-6 shadow-pop">
        <div className="flex items-center justify-between border-b border-ink-100 pb-3">
          <div>
            <h3 className="text-base font-semibold text-ink-900">Create Work Item / Task</h3>
            <p className="text-2xs text-ink-500">Assign deliverables, due dates, and priority levels</p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-ink-400 hover:bg-ink-100">
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded bg-signal-redSoft p-2 text-xs text-signal-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Column reinforcement inspection at Grid 4"
              className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Project Site
              </label>
              <select
                name="site"
                value={formData.site}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                required
              >
                <option value="">-- Choose Site --</option>
                {sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.siteName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Assign Worker / Supervisor
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              >
                <option value="">-- Unassigned --</option>
                {workers.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.fullName} ({w.skill})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Priority Tier
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Target Deadline
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
              Work Breakdown Notes
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Provide technical specifications or QA checkpoints..."
              className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button variant="secondary" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={submitting}>
              {submitting ? 'Assigning...' : 'Assign Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}