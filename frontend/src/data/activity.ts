import type { ActivityEvent, AlertItem } from '../types';

export const activityFeed: ActivityEvent[] = [
{
  id: 'a1',
  kind: 'progress',
  actor: 'A. Kulkarni',
  role: 'Site Engineer',
  message: 'Logged DPR for 18 Aug — 14th slab reinforcement 62% complete, 39 workers deployed.',
  projectCode: 'PRJ-2041',
  time: '12 min ago'
},
{
  id: 'a2',
  kind: 'issue',
  actor: 'V. Joshi',
  role: 'Site Engineer',
  message: 'Raised ISS-1194 — honeycombing in pier P12 shaft, flagged as blocker for pour at P14.',
  projectCode: 'PRJ-2038',
  time: '41 min ago'
},
{
  id: 'a3',
  kind: 'material',
  actor: 'T. Gawde',
  role: 'Stores',
  message: 'Recorded GRN for 386 cum M40 RMC from Suryodaya; balance stock reconciled.',
  projectCode: 'PRJ-2038',
  time: '1 hr ago'
},
{
  id: 'a4',
  kind: 'photo',
  actor: 'D. Patil',
  role: 'Site Engineer',
  message: 'Uploaded 12 site photos — basement waterproofing east wall, before/after treatment.',
  projectCode: 'PRJ-2029',
  time: '2 hrs ago'
},
{
  id: 'a5',
  kind: 'labour',
  actor: 'S. Jadhav',
  role: 'Supervisor',
  message: 'Marked attendance for Crew D & E — 61 of 88 present, 27 absent against plan.',
  projectCode: 'PRJ-2029',
  time: '3 hrs ago'
},
{
  id: 'a6',
  kind: 'expense',
  actor: 'R. Deshmukh',
  role: 'Project Manager',
  message: 'Approved EXP-8839 — crawler crane hire ₹6.85 L for 11 days.',
  projectCode: 'PRJ-2038',
  time: '4 hrs ago'
},
{
  id: 'a7',
  kind: 'document',
  actor: 'A. Kulkarni',
  role: 'Site Engineer',
  message: 'Published Structural GA Level 14–16 Rev-C; Rev-B marked superseded.',
  projectCode: 'PRJ-2041',
  time: '5 hrs ago'
},
{
  id: 'a8',
  kind: 'progress',
  actor: 'M. Shaikh',
  role: 'Site Engineer',
  message: 'Closed task 3.1.04 — clarifier raft PCC levelling grid C4–C9 complete.',
  projectCode: 'PRJ-2052',
  time: 'Yesterday, 6:40 PM'
}];


export const alerts: AlertItem[] = [
{
  id: 'al1',
  level: 'critical',
  title: 'Concrete pour at P14 blocked',
  detail: 'HT line shifting approval pending 14 days; pour window slips to 24 Aug.',
  projectCode: 'PRJ-2038',
  meta: 'Critical path · 4 days lost'
},
{
  id: 'al2',
  level: 'critical',
  title: 'TMT 16mm stock below one day of consumption',
  detail: '4.2 MT against weekly draw of 18.6 MT. Raise PO to Vishwa Steel today.',
  projectCode: 'PRJ-2041',
  meta: 'Reorder level 12 MT'
},
{
  id: 'al3',
  level: 'warning',
  title: 'Aurum Residency 12% behind plan',
  detail: 'Finishing works slipping; 11 open issues and 94% budget consumed at 77% progress.',
  projectCode: 'PRJ-2029',
  meta: 'Cost overrun risk'
},
{
  id: 'al4',
  level: 'warning',
  title: 'Labour turnout 31% short at Aurum',
  detail: '61 of 88 masons and plasterers present for a second consecutive day.',
  projectCode: 'PRJ-2029',
  meta: 'Ekveera Enterprises'
},
{
  id: 'al5',
  level: 'info',
  title: 'Monsoon advisory — heavy rain 20–22 Aug',
  detail: 'Plan slab pours before 20 Aug; secure excavation slopes at Nashik site.',
  projectCode: 'PRJ-2052',
  meta: 'IMD orange alert'
}];


export const sitePhotos = [
{
  id: 'ph1',
  caption: '14th slab reinforcement — bay 3',
  projectCode: 'PRJ-2041',
  time: 'Today, 09:12',
  url: "/45b1e157-1dd9-4d6c-9702-bc3e72c7e960.jpg"
},
{
  id: 'ph2',
  caption: 'Pier P12 shaft after de-shuttering',
  projectCode: 'PRJ-2038',
  time: 'Today, 08:40',
  url: "/15c8d9af-720d-4a0e-8472-ee5dd9dd01c3.jpg"
},
{
  id: 'ph3',
  caption: 'Basement waterproofing — east wall',
  projectCode: 'PRJ-2029',
  time: 'Today, 07:55',
  url: "/00624b1a-6502-4cc2-8cf8-5c0b1cfde9cb.jpg"
},
{
  id: 'ph4',
  caption: 'Clarifier raft PCC levelling',
  projectCode: 'PRJ-2052',
  time: 'Yesterday, 17:20',
  url: "/1ef49646-e8f4-4825-8842-6c91979addc1.jpg"
}];