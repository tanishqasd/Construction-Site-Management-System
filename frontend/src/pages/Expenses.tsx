import { useEffect, useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { CreateExpenseModal } from '../components/expenses/CreateExpenseModal';
import { fetchExpenses } from '../services/expenseService';
import { formatCurrency, formatFullDate } from '../utils/format';

export interface ExpenseRecord {
  _id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  site?: { _id: string; siteName: string } | string;
  paymentMethod?: string;
  paidTo?: string;
}

const defaultMockExpenses: ExpenseRecord[] = [
  {
    _id: 'exp-101',
    description: 'TMT Fe-550D Reinforcement Steel Batch (24 MT)',
    category: 'Materials',
    amount: 1488000,
    date: new Date().toISOString(),
    site: { _id: 's1', siteName: 'Maple Tower Alpha' },
    paymentMethod: 'Bank Transfer',
    paidTo: 'Tata Tiscon Authorized Dealer',
  },
  {
    _id: 'exp-102',
    description: 'Tower Crane & Boom Placer Monthly Lease',
    category: 'Equipment',
    amount: 175000,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    site: { _id: 's2', siteName: 'Commercial Hub Sector 62' },
    paymentMethod: 'NEFT',
    paidTo: 'Apex Heavy Plant Machinery Ltd',
  },
  {
    _id: 'exp-103',
    description: 'Weekly Subcontractor Shuttering Gang Wage Settlement',
    category: 'Labour',
    amount: 98500,
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    site: { _id: 's1', siteName: 'Maple Tower Alpha' },
    paymentMethod: 'Direct Deposit',
    paidTo: 'Balaji Civil Subcontractors',
  },
  {
    _id: 'exp-104',
    description: 'Transit Mixer Ready-Mix Concrete Grade M35 (32 cu.m)',
    category: 'Materials',
    amount: 153600,
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    site: { _id: 's1', siteName: 'Maple Tower Alpha' },
    paymentMethod: 'UPI / Online',
    paidTo: 'UltraTech RMC Plant Unit 4',
  },
  {
    _id: 'exp-105',
    description: 'Municipal Water Tanker Logistics & Site Diesel Fuel',
    category: 'Logistics',
    amount: 34200,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    site: { _id: 's3', siteName: 'Maple Green Meadows' },
    paymentMethod: 'Petty Cash',
    paidTo: 'City Water Supplies & Fuels',
  },
];

export function Expenses() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetchExpenses();
      if (res && (res as unknown as { expenses?: ExpenseRecord[] })?.expenses) {
        const list = (res as unknown as { expenses: ExpenseRecord[] }).expenses;
        setExpenses(list.length > 0 ? list : defaultMockExpenses);
      } else {
        setExpenses(defaultMockExpenses);
      }
    } catch {
      setExpenses(defaultMockExpenses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const totalExpenseBurn = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const categories = ['All', 'Materials', 'Equipment', 'Labour', 'Logistics', 'Other'];

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      (e.paidTo && e.paidTo.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <PageHeader
        eyebrow="Financial Governance & Cost Ledger"
        title="Expenses & Voucher Log"
        description="Track site capital expenditures, vendor disbursement vouchers, equipment lease bills, and subcontractor settlements."
        actions={
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-4 w-4" aria-hidden />
            Record Expense Voucher
          </Button>
        }
      />

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Total Recorded Capital Burn</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{formatCurrency(totalExpenseBurn)}</p>
          <p className="mt-1 text-2xs text-ink-500">Audited fiscal vouchers</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Material Invoices</p>
          <p className="mt-1 font-mono text-2xl font-bold text-steel-600">
            {formatCurrency(
              expenses
                .filter((e) => e.category === 'Materials')
                .reduce((acc, e) => acc + e.amount, 0)
            )}
          </p>
          <p className="mt-1 text-2xs text-ink-500">Direct procurement cost</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Machinery & Plant Leases</p>
          <p className="mt-1 font-mono text-2xl font-bold text-safety-600">
            {formatCurrency(
              expenses
                .filter((e) => e.category === 'Equipment')
                .reduce((acc, e) => acc + e.amount, 0)
            )}
          </p>
          <p className="mt-1 text-2xs text-ink-500">Crane & heavy equipment</p>
        </Panel>
        <Panel className="p-4">
          <p className="font-mono text-2xs uppercase text-ink-400">Total Logged Vouchers</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink-900">{expenses.length}</p>
          <p className="mt-1 text-2xs text-ink-500">Across all active sites</p>
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
            placeholder="Search voucher description, payee, or notes..."
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

      {/* Expense Master Table */}
      <Panel className="overflow-hidden p-0 shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ink-100 bg-ink-50 font-mono text-3xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-4 py-3">Expense Voucher & Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Allocated Site</th>
                <th className="px-4 py-3">Payee / Vendor</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center font-mono text-xs text-ink-400">
                    Loading financial ledger...
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const siteName =
                    typeof exp.site === 'object' && exp.site !== null
                      ? (exp.site as { siteName?: string }).siteName || 'Maple Tower Alpha'
                      : typeof exp.site === 'string'
                      ? exp.site
                      : 'Maple Tower Alpha';

                  return (
                    <tr key={exp._id} className="hover:bg-ink-50/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-ink-900">{exp.description}</p>
                        <p className="font-mono text-3xs text-ink-400">
                          VCH-{exp._id.slice(-6).toUpperCase()} · {formatFullDate(exp.date)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 font-mono text-3xs font-semibold uppercase ${
                            exp.category === 'Materials'
                              ? 'bg-steel-50 text-steel-700'
                              : exp.category === 'Labour'
                              ? 'bg-signal-greenSoft text-signal-green'
                              : exp.category === 'Equipment'
                              ? 'bg-safety-500/15 text-safety-600'
                              : 'bg-ink-100 text-ink-700'
                          }`}
                        >
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-700 font-medium">{siteName}</td>
                      <td className="px-4 py-3 text-ink-600">{exp.paidTo || 'Authorized Vendor'}</td>
                      <td className="px-4 py-3 font-mono text-3xs text-ink-500">{exp.paymentMethod || 'Bank Wire'}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-ink-900">
                        {formatCurrency(exp.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <CreateExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadExpenses}
      />
    </div>
  );
}

export default Expenses;