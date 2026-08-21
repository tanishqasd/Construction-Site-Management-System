import type { Expense } from '../types';

export const expenses: Expense[] = [
{
  id: 'e1',
  voucher: 'EXP-8841',
  category: 'Material Purchase',
  projectCode: 'PRJ-2041',
  amount: 1842000,
  date: '2026-08-17',
  raisedBy: 'A. Kulkarni',
  status: 'Pending',
  note: 'TMT 16mm — 30 MT against PO/4412'
},
{
  id: 'e2',
  voucher: 'EXP-8839',
  category: 'Equipment Hire',
  projectCode: 'PRJ-2038',
  amount: 685000,
  date: '2026-08-16',
  raisedBy: 'V. Joshi',
  status: 'Approved',
  note: 'Crawler crane 80T — 11 days'
},
{
  id: 'e3',
  voucher: 'EXP-8836',
  category: 'Labour Payment',
  projectCode: 'PRJ-2029',
  amount: 2410000,
  date: '2026-08-15',
  raisedBy: 'D. Patil',
  status: 'Approved',
  note: 'Fortnightly RA bill — Ekveera Enterprises'
},
{
  id: 'e4',
  voucher: 'EXP-8834',
  category: 'Site Overheads',
  projectCode: 'PRJ-2052',
  amount: 96400,
  date: '2026-08-14',
  raisedBy: 'M. Shaikh',
  status: 'Reimbursed',
  note: 'Diesel for DG set & dewatering pumps'
},
{
  id: 'e5',
  voucher: 'EXP-8830',
  category: 'Statutory & Fees',
  projectCode: 'PRJ-2029',
  amount: 315000,
  date: '2026-08-13',
  raisedBy: 'R. Deshmukh',
  status: 'Pending',
  note: 'Fire NOC resubmission fee + scrutiny charges'
},
{
  id: 'e6',
  voucher: 'EXP-8827',
  category: 'Transport',
  projectCode: 'PRJ-2038',
  amount: 128500,
  date: '2026-08-12',
  raisedBy: 'Stores — T. Gawde',
  status: 'Rejected',
  note: 'Duplicate freight claim against LR-2291'
},
{
  id: 'e7',
  voucher: 'EXP-8824',
  category: 'Safety & PPE',
  projectCode: 'PRJ-2041',
  amount: 74200,
  date: '2026-08-11',
  raisedBy: 'HSE — N. Bhosale',
  status: 'Approved',
  note: 'Full body harnesses (40 nos) & helmets'
},
{
  id: 'e8',
  voucher: 'EXP-8820',
  category: 'Material Purchase',
  projectCode: 'PRJ-2057',
  amount: 542000,
  date: '2026-08-10',
  raisedBy: 'K. Rane',
  status: 'Approved',
  note: 'PCC aggregate & sand — foundation works'
}];


export const expenseByCategory = [
{ category: 'Material', amount: 1284 },
{ category: 'Labour', amount: 862 },
{ category: 'Equipment', amount: 431 },
{ category: 'Overheads', amount: 196 },
{ category: 'Statutory', amount: 88 }];