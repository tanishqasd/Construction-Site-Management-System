import type { Issue } from '../types';

export const issues: Issue[] = [
{
  id: 'i1',
  ref: 'ISS-1194',
  title: 'Honeycombing observed in pier P12 shaft after de-shuttering',
  projectCode: 'PRJ-2038',
  location: 'Chainage 4+120, Pier P12',
  severity: 'Blocker',
  status: 'Open',
  category: 'Quality',
  raisedBy: 'V. Joshi',
  raisedOn: '2026-08-16',
  ageDays: 2
},
{
  id: 'i2',
  ref: 'ISS-1191',
  title: 'Edge protection missing on 13th floor south periphery',
  projectCode: 'PRJ-2041',
  location: 'Tower B, Level 13',
  severity: 'Blocker',
  status: 'In Review',
  category: 'Safety',
  raisedBy: 'HSE — N. Bhosale',
  raisedOn: '2026-08-15',
  ageDays: 3
},
{
  id: 'i3',
  ref: 'ISS-1188',
  title: 'Ground water ingress at basement raft joint — dewatering inadequate',
  projectCode: 'PRJ-2029',
  location: 'Tower 3 basement, grid E2',
  severity: 'Major',
  status: 'Open',
  category: 'Execution',
  raisedBy: 'D. Patil',
  raisedOn: '2026-08-12',
  ageDays: 6
},
{
  id: 'i4',
  ref: 'ISS-1186',
  title: 'Structural drawing Rev-D conflicts with executed column layout',
  projectCode: 'PRJ-2029',
  location: 'Tower 2, Level 8',
  severity: 'Blocker',
  status: 'Open',
  category: 'Design',
  raisedBy: 'R. Deshmukh',
  raisedOn: '2026-08-10',
  ageDays: 8
},
{
  id: 'i5',
  ref: 'ISS-1183',
  title: 'Utility shifting pending — HT line over pier P16',
  projectCode: 'PRJ-2038',
  location: 'Chainage 4+310',
  severity: 'Blocker',
  status: 'Open',
  category: 'Approvals',
  raisedBy: 'S. Nair',
  raisedOn: '2026-08-04',
  ageDays: 14
},
{
  id: 'i6',
  ref: 'ISS-1180',
  title: 'Cube strength shortfall in batch B-2209 (24.6 MPa @ 7 day)',
  projectCode: 'PRJ-2041',
  location: 'Tower B, Level 12 slab',
  severity: 'Major',
  status: 'In Review',
  category: 'Quality',
  raisedBy: 'A. Kulkarni',
  raisedOn: '2026-08-08',
  ageDays: 10
},
{
  id: 'i7',
  ref: 'ISS-1176',
  title: 'Access road washout after rainfall — material movement halted',
  projectCode: 'PRJ-2052',
  location: 'Site entry gate 2',
  severity: 'Minor',
  status: 'Resolved',
  category: 'Execution',
  raisedBy: 'M. Shaikh',
  raisedOn: '2026-08-02',
  ageDays: 16
},
{
  id: 'i8',
  ref: 'ISS-1172',
  title: 'Plaster surface undulation beyond tolerance — Wing C',
  projectCode: 'PRJ-2029',
  location: 'Tower 1, Levels 4–6',
  severity: 'Minor',
  status: 'In Review',
  category: 'Quality',
  raisedBy: 'D. Patil',
  raisedOn: '2026-07-30',
  ageDays: 19
}];


export const openIssues = issues.filter((i) => i.status !== 'Resolved');