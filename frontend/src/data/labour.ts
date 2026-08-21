import type { LabourRecord } from '../types';

export const labourRecords: LabourRecord[] = [
{
  id: 'l1',
  crew: 'Crew A — Bar Benders',
  contractor: 'Shivneri Labour Contractors',
  projectCode: 'PRJ-2041',
  trade: 'Steel Fixing',
  strength: 42,
  present: 39,
  shift: 'Day',
  supervisor: 'B. Kadam',
  dailyWage: 780
},
{
  id: 'l2',
  crew: 'Crew B — Carpenters',
  contractor: 'Shivneri Labour Contractors',
  projectCode: 'PRJ-2041',
  trade: 'Shuttering',
  strength: 36,
  present: 31,
  shift: 'Day',
  supervisor: 'B. Kadam',
  dailyWage: 820
},
{
  id: 'l3',
  crew: 'Crew C — Concreting (Night)',
  contractor: 'Suryodaya Manpower',
  projectCode: 'PRJ-2038',
  trade: 'Concreting',
  strength: 54,
  present: 54,
  shift: 'Night',
  supervisor: 'I. Ansari',
  dailyWage: 900
},
{
  id: 'l4',
  crew: 'Crew D — Masons',
  contractor: 'Ekveera Enterprises',
  projectCode: 'PRJ-2029',
  trade: 'Blockwork',
  strength: 48,
  present: 33,
  shift: 'Day',
  supervisor: 'S. Jadhav',
  dailyWage: 760
},
{
  id: 'l5',
  crew: 'Crew E — Plasterers',
  contractor: 'Ekveera Enterprises',
  projectCode: 'PRJ-2029',
  trade: 'Plaster',
  strength: 40,
  present: 28,
  shift: 'Day',
  supervisor: 'S. Jadhav',
  dailyWage: 745
},
{
  id: 'l6',
  crew: 'Crew F — Earthwork & Excavation',
  contractor: 'Godavari Infra Labour',
  projectCode: 'PRJ-2052',
  trade: 'Earthwork',
  strength: 30,
  present: 30,
  shift: 'Day',
  supervisor: 'R. Wagh',
  dailyWage: 700
},
{
  id: 'l7',
  crew: 'Crew G — Helpers',
  contractor: 'Godavari Infra Labour',
  projectCode: 'PRJ-2057',
  trade: 'General',
  strength: 26,
  present: 22,
  shift: 'Day',
  supervisor: 'R. Wagh',
  dailyWage: 620
}];


export const attendanceTrend = [
{ day: 'Wed', present: 812, absent: 96 },
{ day: 'Thu', present: 838, absent: 70 },
{ day: 'Fri', present: 795, absent: 113 },
{ day: 'Sat', present: 861, absent: 47 },
{ day: 'Mon', present: 704, absent: 204 },
{ day: 'Tue', present: 237, absent: 39 }];