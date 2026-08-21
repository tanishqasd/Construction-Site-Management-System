import { useEffect, useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  BoxesIcon,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { AddMaterialModal } from '../components/materials/AddMaterialModal';
import { fetchMaterials, MaterialItem } from '../services/materialService';
import { formatCurrency } from '../utils/format';

const defaultMockMaterials: MaterialItem[] = [
  {
    _id: 'mat-001',
    materialName: 'TMT Reinforcement Steel 16mm (Fe 550D)',
    category: 'Steel',
    quantity: 4.2,
    unit: 'Ton',
    costPerUnit: 62000,
    site: { _id: 's1', siteName: 'Maple Tower Alpha' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mat-002',
    materialName: 'Ordinary Portland Cement (OPC 53 Grade)',
    category: 'Cement',
    quantity: 340,
    unit: 'Bag',
    costPerUnit: 380,
    site: { _id: 's1', siteName: 'Maple Tower Alpha' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mat-003',
    materialName: 'Crushed Coarse Aggregate (20mm Blue Metal)',
    category: 'Gravel',
    quantity: 45,
    unit: 'Cubic Meter',
    costPerUnit: 4200,
    site: { _id: 's2', siteName: 'Commercial Hub Sector 62' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mat-004',
    materialName: 'AAC Blocks (600 x 200 x 150 mm)',
    category: 'Bricks',
    quantity: 1850,
    unit: 'Piece',
    costPerUnit: 65,
    site: { _id: 's2', siteName: 'Commercial Hub Sector 62' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mat-005',
    materialName: 'Ready-Mix Concrete Grade M35',
    category: 'Other',
    quantity: 12,
    unit: 'Cubic Meter',
    costPerUnit: 4800,
    site: { _id: 's1', siteName: 'Maple Tower Alpha' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mat-006',
    materialName: 'PVC Electrical Conduit Pipe 25mm Heavy',
    category: 'Electrical',
    quantity: 60,
    unit: 'Piece',
    costPerUnit: 1100,
    site: { _id: 's3', siteName: 'Maple Green Meadows' },
    createdAt: new Date().toISOString(),
  },
];

export function Materials() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const res = await fetchMaterials();
      if (res.materials && res.materials.length > 0) {
        setMaterials(res.materials);
      } else {
        setMaterials(defaultMockMaterials);
      }
    } catch {
      setMaterials(defaultMockMaterials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const getMaterialCost = (m: MaterialItem): number => {
    const record = m as unknown as Record<string, unknown>;
    const rate = record.costPerUnit ?? record.unitPrice ?? record.ratePerUnit ?? 0;
    return typeof rate === 'number' ? rate : Number(rate) || 0;
  };

  const totalInventoryValuation = materials.reduce(
    (acc, m) => acc + (m.quantity || 0) * getMaterialCost(m),
    0
  );

  const categories = [
    'All',
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

  const filteredMaterials = materials.filter((m) => {
    const name = m.materialName || '';
    const category = m.category || '';
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <PageHeader
        eyebrow="Procurement & Inventory"
        title="Material & Stock Ledger"
        description="Monitor site inventory levels, batch procurement receipts, and total asset valuation."
        actions={
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-4 w-4" aria-hidden />
            Receive Stock
          </Button>
        }
      />

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Total Stock Valuation</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{formatCurrency(totalInventoryValuation)}</p>
          <p className="mt-1 text-2xs text-ink-500">Live book inventory value</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Total Tracked SKUs</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{materials.length}</p>
          <p className="mt-1 text-2xs text-ink-500">Across all operational sites</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Active Material Categories</p>
          <p className="mt-1 font-mono text-2xl font-bold text-steel-600">{categories.length - 1}</p>
          <p className="mt-1 text-2xs text-ink-500">Standardized classifications</p>
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
            placeholder="Search material description or category..."
            className="w-full rounded-md border border-ink-200 bg-white py-2 pl-9 pr-3 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded px-3 py-1 text-2xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-ink-900 text-white'
                  : 'border border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Master Table */}
      <Panel className="overflow-hidden p-0 shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ink-100 bg-ink-50 font-mono text-3xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-4 py-3">Material Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Allocated Site</th>
                <th className="px-4 py-3 text-right">Available Stock</th>
                <th className="px-4 py-3 text-right">Unit Rate</th>
                <th className="px-4 py-3 text-right">Total Valuation</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center font-mono text-xs text-ink-400">
                    Loading inventory catalog...
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((m) => {
                  const unitCost = getMaterialCost(m);
                  const totalItemValuation = (m.quantity || 0) * unitCost;
                  const siteRecord = m.site as unknown as { siteName?: string } | string | undefined;
                  const siteName =
                    typeof siteRecord === 'object' && siteRecord !== null
                      ? siteRecord.siteName || 'Maple Site Alpha'
                      : typeof siteRecord === 'string'
                      ? siteRecord
                      : 'Maple Site Alpha';

                  return (
                    <tr key={m._id} className="hover:bg-ink-50/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-ink-900">{m.materialName}</p>
                        <p className="font-mono text-3xs text-ink-400">SKU: {m._id.slice(-6).toUpperCase()}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-ink-100 px-2 py-0.5 text-2xs text-ink-700">
                          {m.category || 'General'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-600">{siteName}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-ink-900">
                        {m.quantity.toLocaleString()} <span className="text-2xs text-ink-500">{m.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-ink-600">
                        {formatCurrency(unitCost)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-ink-900">
                        {formatCurrency(totalItemValuation)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 rounded bg-signal-greenSoft px-2 py-0.5 font-mono text-3xs font-semibold text-signal-green">
                          <BoxesIcon className="h-3 w-3" /> In Stock
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}

              {!loading && filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs text-ink-500">
                    No material items found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <AddMaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadMaterials}
      />
    </div>
  );
}

export default Materials;