import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { createExpense, ExpenseRecord } from '../../services/expenseService';
import { getSites, Site } from '../../services/siteService';

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newExpense: ExpenseRecord) => void;
}

const categories: ExpenseRecord['category'][] = [
  'Material',
  'Labour',
  'Transport',
  'Equipment',
  'Maintenance',
  'Miscellaneous',
];

export function CreateExpenseModal({ isOpen, onClose, onSuccess }: CreateExpenseModalProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [formData, setFormData] = useState({
    site: '',
    category: 'Material' as ExpenseRecord['category'],
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
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
      setError('Please designate a project site for this expenditure.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await createExpense({
        site: { _id: formData.site, siteName: '' },
        category: formData.category,
        description: formData.description,
        amount: Number(formData.amount),
        expenseDate: formData.expenseDate,
      });

      // Augment populated site metadata for instant UI display
      const targetSite = sites.find((s) => s._id === formData.site);
      const augmentedExpense: ExpenseRecord = {
        ...response.expense,
        site: {
          _id: formData.site,
          siteName: targetSite?.siteName || 'General Project',
        },
      };

      onSuccess(augmentedExpense);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to record expense voucher.');
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
            <h3 className="text-base font-semibold text-ink-900">Record Expenditure Voucher</h3>
            <p className="text-2xs text-ink-500">Log audited bills, material invoices, and site disbursements</p>
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
                Expense Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g., 45000"
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Posting / Invoice Date
              </label>
              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
              Particulars / Line Item Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="e.g., Diesel generator refuel batch for night shift operations..."
              className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button variant="secondary" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Voucher'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}