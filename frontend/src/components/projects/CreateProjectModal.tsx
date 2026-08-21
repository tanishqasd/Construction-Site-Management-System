import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { createSite, Site } from '../../services/siteService';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSite: Site) => void;
}

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    siteName: '',
    location: '',
    clientName: '',
    budget: '',
    startDate: '',
    expectedEndDate: '',
    status: 'Planning' as Site['status'],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await createSite({
        ...formData,
        budget: Number(formData.budget),
      });
      onSuccess(response.site);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create new project.');
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
            <h3 className="text-base font-semibold text-ink-900">New Construction Site</h3>
            <p className="text-2xs text-ink-500">Register project charter and allocated contract budget</p>
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
              Site / Project Name
            </label>
            <input
              type="text"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              placeholder="e.g., Aurum Residency Tower B"
              className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Kalyani Nagar, Pune"
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Client / Developer
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="e.g., Nexus Realty Corp"
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Contract Budget (₹)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., 50000000"
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Initial Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              >
                <option value="Planning">Planning</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Commencement Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Target Completion
              </label>
              <input
                type="date"
                name="expectedEndDate"
                value={formData.expectedEndDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button variant="secondary" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Register Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}