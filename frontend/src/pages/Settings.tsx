import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Panel, PanelHeader } from '../components/ui/Panel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableWrap, Th, Td, Tr } from '../components/ui/Table';

const users = [
{ id: 'u1', name: 'Rohit Deshmukh', email: 'rohit.d@sthapatya.co.in', role: 'Project Manager', projects: 2, status: 'Approved' },
{ id: 'u2', name: 'Lena Fernandes', email: 'lena.f@sthapatya.co.in', role: 'Admin', projects: 6, status: 'Approved' },
{ id: 'u3', name: 'Anuj Kulkarni', email: 'anuj.k@sthapatya.co.in', role: 'Site Engineer', projects: 1, status: 'Approved' },
{ id: 'u4', name: 'Vikram Joshi', email: 'vikram.j@sthapatya.co.in', role: 'Site Engineer', projects: 1, status: 'Approved' },
{ id: 'u5', name: 'Mehul Shaikh', email: 'mehul.s@sthapatya.co.in', role: 'Site Engineer', projects: 1, status: 'Pending' }];


const permissions = [
{ capability: 'Approve expenses above ₹1 L', admin: true, pm: true, se: false },
{ capability: 'Publish drawing revisions', admin: true, pm: true, se: false },
{ capability: 'Submit daily progress report', admin: true, pm: true, se: true },
{ capability: 'Close blocker issues', admin: true, pm: true, se: false },
{ capability: 'Edit labour muster after cut-off', admin: true, pm: false, se: false }];


const toggles = [
{ label: 'DPR submission reminder', detail: 'Notify site engineers at 5:30 PM if DPR is not submitted.', on: true },
{ label: 'Material reorder alerts', detail: 'Alert stores and PM when stock falls below reorder level.', on: true },
{ label: 'Blocker escalation to client', detail: 'Auto-share blockers open beyond 7 days with the client PMC.', on: false },
{ label: 'Weekly cost summary email', detail: 'Send Monday morning cost and progress digest to management.', on: true }];


export function Settings() {
  const [switches, setSwitches] = useState(toggles.map((t) => t.on));

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Manage users, role permissions and site notification rules for Sthapatya Infra."
        actions={
        <Button variant="primary" size="md">
            <PlusIcon className="h-4 w-4" aria-hidden />
            Invite user
          </Button>
        } />
      

      <Panel className="mb-4 overflow-hidden">
        <PanelHeader title="Users & roles" subtitle="5 users across 3 roles" />
        <TableWrap>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th align="right">Projects</Th>
              <Th>Access</Th>
              <Th align="right" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) =>
            <Tr key={u.id}>
                <Td className="text-xs font-semibold text-ink-900">{u.name}</Td>
                <Td className="text-xs text-ink-600">{u.email}</Td>
                <Td className="text-xs">{u.role}</Td>
                <Td align="right" className="font-mono text-2xs">
                  {u.projects}
                </Td>
                <Td>
                  <StatusBadge label={u.status === 'Approved' ? 'Approved' : 'Pending'} />
                </Td>
                <Td align="right">
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                </Td>
              </Tr>
            )}
          </tbody>
        </TableWrap>
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="overflow-hidden">
          <PanelHeader title="Role permissions" subtitle="Applies to every project unless overridden" />
          <TableWrap className="overflow-visible">
            <thead>
              <tr>
                <Th>Capability</Th>
                <Th align="center">Admin</Th>
                <Th align="center">PM</Th>
                <Th align="center">Engineer</Th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p) =>
              <Tr key={p.capability}>
                  <Td className="text-xs">{p.capability}</Td>
                  {[p.admin, p.pm, p.se].map((allowed, i) =>
                <Td key={i} align="center">
                      <span
                    className={twMerge(
                      'inline-block h-2 w-2 rounded-full',
                      allowed ? 'bg-signal-green' : 'bg-ink-200'
                    )}
                    aria-label={allowed ? 'Allowed' : 'Not allowed'} />
                  
                    </Td>
                )}
                </Tr>
              )}
            </tbody>
          </TableWrap>
        </Panel>

        <Panel>
          <PanelHeader title="Notification rules" subtitle="Applies to your account and site teams" />
          <ul className="divide-y divide-ink-100">
            {toggles.map((t, i) =>
            <li key={t.label} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink-900">{t.label}</p>
                  <p className="mt-0.5 text-2xs leading-snug text-ink-500">{t.detail}</p>
                </div>
                <button
                type="button"
                role="switch"
                aria-checked={switches[i]}
                aria-label={t.label}
                onClick={() =>
                setSwitches((prev) => prev.map((v, idx) => idx === i ? !v : v))
                }
                className={twMerge(
                  'relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors duration-150',
                  switches[i] ? 'bg-ink-900' : 'bg-ink-200'
                )}>
                
                  <span
                  className={twMerge(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-150 ease-out',
                    switches[i] ? 'translate-x-4.5' : 'translate-x-0.5'
                  )} />
                
                </button>
              </li>
            )}
          </ul>
        </Panel>
      </div>
    </div>);

}