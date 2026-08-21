import type { Task } from '../types';

export const tasks: Task[] = [
{
  id: 't1',
  title: 'Shuttering & reinforcement — 15th floor slab',
  projectCode: 'PRJ-2041',
  projectName: 'Skyline Business Park — Tower B',
  assignee: 'A. Kulkarni',
  status: 'In Progress',
  priority: 'High',
  dueDate: '2026-08-21',
  overdueDays: 0,
  progress: 62,
  wbs: '3.4.12'
},
{
  id: 't2',
  title: 'Pier cap P14 concrete pour — M40',
  projectCode: 'PRJ-2038',
  projectName: 'Ring Road Flyover — Package 3',
  assignee: 'V. Joshi',
  status: 'Blocked',
  priority: 'Critical',
  dueDate: '2026-08-14',
  overdueDays: 4,
  progress: 30,
  wbs: '2.2.07'
},
{
  id: 't3',
  title: 'Waterproofing — basement retaining wall east',
  projectCode: 'PRJ-2029',
  projectName: 'Aurum Residency — Phase 1',
  assignee: 'D. Patil',
  status: 'In Progress',
  priority: 'High',
  dueDate: '2026-08-16',
  overdueDays: 2,
  progress: 74,
  wbs: '5.1.03'
},
{
  id: 't4',
  title: 'Submit revised bar bending schedule (Rev-C)',
  projectCode: 'PRJ-2052',
  projectName: 'Greenfield Water Treatment Plant',
  assignee: 'M. Shaikh',
  status: 'Review',
  priority: 'Medium',
  dueDate: '2026-08-19',
  overdueDays: 0,
  progress: 90,
  wbs: '1.6.02'
},
{
  id: 't5',
  title: 'Anti-termite treatment before PCC — Unit 4 bay 2',
  projectCode: 'PRJ-2057',
  projectName: 'Industrial Warehouse Cluster',
  assignee: 'K. Rane',
  status: 'Not Started',
  priority: 'Medium',
  dueDate: '2026-08-24',
  overdueDays: 0,
  progress: 0,
  wbs: '2.1.09'
},
{
  id: 't6',
  title: 'Cube test results — 7 day, batch B-2214',
  projectCode: 'PRJ-2041',
  projectName: 'Skyline Business Park — Tower B',
  assignee: 'QA Lab — Suryodaya',
  status: 'In Progress',
  priority: 'Critical',
  dueDate: '2026-08-13',
  overdueDays: 5,
  progress: 45,
  wbs: '7.3.01'
},
{
  id: 't7',
  title: 'Lift shaft alignment survey — Tower 3',
  projectCode: 'PRJ-2029',
  projectName: 'Aurum Residency — Phase 1',
  assignee: 'D. Patil',
  status: 'Not Started',
  priority: 'High',
  dueDate: '2026-08-12',
  overdueDays: 6,
  progress: 0,
  wbs: '6.2.11'
},
{
  id: 't8',
  title: 'Bituminous approach road — layer 1',
  projectCode: 'PRJ-2038',
  projectName: 'Ring Road Flyover — Package 3',
  assignee: 'S. Nair',
  status: 'Not Started',
  priority: 'Low',
  dueDate: '2026-09-02',
  overdueDays: 0,
  progress: 0,
  wbs: '4.5.02'
},
{
  id: 't9',
  title: 'Fire NOC drawing resubmission to authority',
  projectCode: 'PRJ-2029',
  projectName: 'Aurum Residency — Phase 1',
  assignee: 'R. Deshmukh',
  status: 'Review',
  priority: 'Critical',
  dueDate: '2026-08-10',
  overdueDays: 8,
  progress: 55,
  wbs: '1.2.14'
},
{
  id: 't10',
  title: 'Clarifier raft PCC levelling — grid C4–C9',
  projectCode: 'PRJ-2052',
  projectName: 'Greenfield Water Treatment Plant',
  assignee: 'M. Shaikh',
  status: 'Completed',
  priority: 'Medium',
  dueDate: '2026-08-11',
  overdueDays: 0,
  progress: 100,
  wbs: '3.1.04'
},
{
  id: 't11',
  title: 'Scaffolding safety audit — Tower B external',
  projectCode: 'PRJ-2041',
  projectName: 'Skyline Business Park — Tower B',
  assignee: 'HSE — N. Bhosale',
  status: 'In Progress',
  priority: 'High',
  dueDate: '2026-08-20',
  overdueDays: 0,
  progress: 35,
  wbs: '8.1.06'
},
{
  id: 't12',
  title: 'Reconcile steel receipts against MRN — July',
  projectCode: 'PRJ-2038',
  projectName: 'Ring Road Flyover — Package 3',
  assignee: 'Stores — T. Gawde',
  status: 'In Progress',
  priority: 'Medium',
  dueDate: '2026-08-22',
  overdueDays: 0,
  progress: 50,
  wbs: '9.4.01'
}];


export const overdueTasks = tasks.filter((t) => t.overdueDays > 0);
export const pendingTasks = tasks.filter((t) => t.status !== 'Completed');