import type { Material } from '../types';

export const materials: Material[] = [
{
  id: 'm1',
  name: 'TMT Steel Bars — Fe500D, 16mm',
  unit: 'MT',
  projectCode: 'PRJ-2041',
  inStock: 4.2,
  reorderLevel: 12,
  consumedThisWeek: 18.6,
  state: 'Critical',
  supplier: 'Vishwa Steel Traders',
  lastDelivery: '2026-08-11',
  rate: 61500
},
{
  id: 'm2',
  name: 'OPC 53 Grade Cement',
  unit: 'Bags',
  projectCode: 'PRJ-2038',
  inStock: 310,
  reorderLevel: 800,
  consumedThisWeek: 1240,
  state: 'Critical',
  supplier: 'Konark Cement Depot',
  lastDelivery: '2026-08-13',
  rate: 372
},
{
  id: 'm3',
  name: 'Ready Mix Concrete — M40',
  unit: 'cum',
  projectCode: 'PRJ-2038',
  inStock: 0,
  reorderLevel: 0,
  consumedThisWeek: 386,
  state: 'Ordered',
  supplier: 'Suryodaya RMC',
  lastDelivery: '2026-08-17',
  rate: 6250
},
{
  id: 'm4',
  name: 'Aggregate 20mm',
  unit: 'brass',
  projectCode: 'PRJ-2029',
  inStock: 9,
  reorderLevel: 15,
  consumedThisWeek: 22,
  state: 'Low',
  supplier: 'Patil Quarry Works',
  lastDelivery: '2026-08-09',
  rate: 5400
},
{
  id: 'm5',
  name: 'AAC Blocks 200mm',
  unit: 'Nos',
  projectCode: 'PRJ-2029',
  inStock: 1860,
  reorderLevel: 2500,
  consumedThisWeek: 3400,
  state: 'Low',
  supplier: 'Buildmate AAC',
  lastDelivery: '2026-08-12',
  rate: 78
},
{
  id: 'm6',
  name: 'River Sand (washed)',
  unit: 'brass',
  projectCode: 'PRJ-2052',
  inStock: 24,
  reorderLevel: 12,
  consumedThisWeek: 8,
  state: 'Healthy',
  supplier: 'Godavari Sand Suppliers',
  lastDelivery: '2026-08-15',
  rate: 7100
},
{
  id: 'm7',
  name: 'Shuttering Plywood 12mm',
  unit: 'Sheets',
  projectCode: 'PRJ-2041',
  inStock: 420,
  reorderLevel: 150,
  consumedThisWeek: 60,
  state: 'Healthy',
  supplier: 'Anand Ply & Hardware',
  lastDelivery: '2026-08-06',
  rate: 1180
},
{
  id: 'm8',
  name: 'Bitumen VG-30',
  unit: 'MT',
  projectCode: 'PRJ-2038',
  inStock: 6,
  reorderLevel: 10,
  consumedThisWeek: 0,
  state: 'Low',
  supplier: 'Highway Bitumen Co.',
  lastDelivery: '2026-07-29',
  rate: 48900
},
{
  id: 'm9',
  name: 'Waterproofing Membrane — APP 3mm',
  unit: 'Rolls',
  projectCode: 'PRJ-2029',
  inStock: 12,
  reorderLevel: 40,
  consumedThisWeek: 55,
  state: 'Critical',
  supplier: 'Seal-Tech India',
  lastDelivery: '2026-08-08',
  rate: 3250
},
{
  id: 'm10',
  name: 'Binding Wire 18 SWG',
  unit: 'kg',
  projectCode: 'PRJ-2057',
  inStock: 640,
  reorderLevel: 200,
  consumedThisWeek: 95,
  state: 'Healthy',
  supplier: 'Vishwa Steel Traders',
  lastDelivery: '2026-08-14',
  rate: 82
}];


export const materialAlerts = materials.filter(
  (m) => m.state === 'Critical' || m.state === 'Low'
);