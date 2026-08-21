import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { createMaterial, MaterialItem } from '../../services/materialService';
import { getSites, Site } from '../../services/siteService';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMaterial: MaterialItem) => void;
}

const categories: MaterialItem['category'][] = [
  'Cement',
  'Steel',
  'Bricks',
  'Sand',
  'Gravel',
  'Paint',
  'Electrical',
  'Plumbing',
  'Other',
];

const units: MaterialItem['unit'][] = [
  'Bag',
  'Ton',
  'Kg',
  'Piece',
  'Litre',
  'Cubic Meter',
];

export function AddMaterialModal({ isOpen, onClose, onSuccess }: AddMaterialModalProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [formData, setFormData] = useState({
    materialName: '',
    category: 'Cement' as MaterialItem['category'],
    quantity: '',
    unit: 'Bag' as MaterialItem['unit'],
    costPerUnit: '',
    site: '',
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.site) {
      setError('Please assign this material stock to a site location.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await createMaterial({
        materialName: formData.materialName,
        category: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        costPerUnit: Number(formData.costPerUnit),
        site: { _id: formData.site, siteName: '' },
      });

      const targetSite = sites.find((s) => s._id === formData.site);
      const augmentedMaterial: MaterialItem = {
        ...response.material,
        site: {
          _id: formData.site,
          siteName: targetSite?.siteName || 'Site Location',
        },
      };

      onSuccess(augmentedMaterial);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add material inventory.');
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
            <h3 className="text-base font-semibold text-ink-900">Add Material Stock</h3>
            <p className="text-2xs text-ink-500">Record incoming inventory batch, unit rates, and site storage</p>
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
              Material / Item Name
            </label>
            <input
              type="text"
              name="materialName"
              value={formData.materialName}
              onChange={handleChange}
              placeholder="e.g., UltraTech OPC 53 Grade Cement"
              className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Destination Site
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
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 500"
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Unit Metric
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Rate / Unit (₹)
              </label>
              <input
                type="number"
                name="costPerUnit"
                value={formData.costPerUnit}
                onChange={handleChange}
                placeholder="e.g., 380"
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
              {submitting ? 'Adding...' : 'Add to Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}