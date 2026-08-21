import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { createIssue, IssueItem } from '../../services/issueService';
import { getSites, Site } from '../../services/siteService';

interface RaiseIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newIssue: IssueItem) => void;
}

export function RaiseIssueModal({ isOpen, onClose, onSuccess }: RaiseIssueModalProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    site: '',
    severity: 'Medium' as IssueItem['severity'],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      getSites()
        .then((res) => {
          const siteList = res.sites || [];
          setSites(siteList);
          if (siteList.length > 0) {
            setFormData((prev) => (prev.site ? prev : { ...prev, site: siteList[0]._id }));
          }
        })
        .catch((err) => console.error('Failed to load project sites:', err));
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
      setError('Please select the affected site location.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await createIssue({
        title: formData.title,
        description: formData.description,
        site: { _id: formData.site, siteName: '', location: '' },
        severity: formData.severity,
      });

      const targetSite = sites.find((s) => s._id === formData.site);
      const augmentedIssue: IssueItem = {
        ...response.issue,
        site: {
          _id: formData.site,
          siteName: targetSite?.siteName || 'Project Site',
          location: targetSite?.location || 'Site Location',
        },
      };

      onSuccess(augmentedIssue);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to report issue.');
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
            <h3 className="text-base font-semibold text-ink-900">Raise Site Incident / Issue</h3>
            <p className="text-2xs text-ink-500">Report quality snags, safety hazards, or design blockers</p>
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
              Issue Summary / Headline
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Honeycombing observed at Pier P12"
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
                <option value="">-- Select Site --</option>
                {sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.siteName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Severity Level
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical (Blocker)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
              Detailed Observation / Defect Details
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the defect, location coordinates, or safety hold requirement..."
              className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button variant="secondary" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Log Incident'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}