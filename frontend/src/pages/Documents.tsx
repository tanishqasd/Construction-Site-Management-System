import React, { useState } from 'react';
import { UploadIcon, FileIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Panel, PanelHeader } from '../components/ui/Panel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { FilterBar } from '../components/ui/FilterBar';
import { TableWrap, Th, Td, Tr } from '../components/ui/Table';
import { documents } from '../data/documents';
import { formatFullDate } from '../utils/format';

const filters = ['All', 'Drawing', 'Permit', 'Contract', 'Report', 'Certificate'];

export function Documents() {
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');

  const visible = documents.filter(
    (d) =>
    (active === 'All' || d.type === active) && (
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.uploadedBy.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <PageHeader
        eyebrow="Document control"
        title="Documents"
        description="Drawing registers, permits, contracts and test certificates with revision control."
        actions={
        <>
            <Button variant="secondary" size="md">
              Transmittal log
            </Button>
            <Button variant="primary" size="md">
              <UploadIcon className="h-4 w-4" aria-hidden />
              Upload document
            </Button>
          </>
        } />
      

      <Panel className="mb-4 p-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
          { label: 'Total documents', value: '318' },
          { label: 'Awaiting review', value: '2', tone: 'text-signal-amber' },
          { label: 'Superseded revisions', value: '46', tone: 'text-ink-500' },
          { label: 'Latest transmittal', value: 'TRN-092' }].
          map((s) =>
          <div key={s.label}>
              <p className="font-mono text-2xs uppercase tracking-wider text-ink-400">{s.label}</p>
              <p className={`mt-1 font-mono text-lg font-semibold ${s.tone ?? 'text-ink-900'}`}>
                {s.value}
              </p>
            </div>
          )}
        </div>
      </Panel>

      <FilterBar
        searchPlaceholder="Search document name or uploader…"
        filters={filters}
        active={active}
        onChange={setActive}
        query={query}
        onQueryChange={setQuery} />
      

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Document register"
          subtitle={`${visible.length} of ${documents.length} documents shown`} />
        
        <TableWrap>
          <thead>
            <tr>
              <Th>Document</Th>
              <Th>Type</Th>
              <Th>Project</Th>
              <Th>Revision</Th>
              <Th>Status</Th>
              <Th>Uploaded by</Th>
              <Th align="right">Uploaded on</Th>
              <Th align="right">Size</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((d) =>
            <Tr key={d.id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden />
                    <span
                    className={`truncate text-xs font-semibold ${
                    d.status === 'Superseded' ? 'text-ink-400 line-through' : 'text-ink-900'}`
                    }>
                    
                      {d.name}
                    </span>
                  </div>
                </Td>
                <Td className="text-xs">{d.type}</Td>
                <Td className="font-mono text-2xs text-ink-500">{d.projectCode}</Td>
                <Td className="font-mono text-2xs text-ink-700">{d.revision}</Td>
                <Td>
                  <StatusBadge label={d.status} />
                </Td>
                <Td className="text-xs">{d.uploadedBy}</Td>
                <Td align="right" className="font-mono text-2xs text-ink-600">
                  {formatFullDate(d.uploadedOn)}
                </Td>
                <Td align="right" className="font-mono text-2xs text-ink-500">
                  {d.size}
                </Td>
              </Tr>
            )}
          </tbody>
        </TableWrap>
        {visible.length === 0 &&
        <p className="px-4 py-12 text-center text-xs text-ink-500">No documents match these filters.</p>
        }
      </Panel>
    </div>);

}