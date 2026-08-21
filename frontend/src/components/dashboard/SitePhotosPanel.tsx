import React from 'react';
import { CameraIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { sitePhotos } from '../../data/activity';
import { Button } from '../ui/Button';

export function SitePhotosPanel() {
  return (
    <Panel>
      <PanelHeader
        title="Site photos"
        subtitle="Latest geo-tagged uploads from the field"
        action={
        <Button variant="secondary" size="sm">
            <CameraIcon className="h-3.5 w-3.5" aria-hidden />
            Upload
          </Button>
        } />
      
      <div className="grid grid-cols-2 gap-2 p-3">
        {sitePhotos.map((photo) =>
        <figure key={photo.id} className="group overflow-hidden rounded-md border border-ink-200">
            <div className="aspect-[4/3] overflow-hidden bg-ink-100">
              <img
              src={photo.url}
              alt={photo.caption}
              className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
              loading="lazy" />
            
            </div>
            <figcaption className="px-2 py-1.5">
              <p className="truncate text-2xs font-medium text-ink-800">{photo.caption}</p>
              <p className="mt-0.5 truncate font-mono text-2xs text-ink-400">
                {photo.projectCode} · {photo.time}
              </p>
            </figcaption>
          </figure>
        )}
      </div>
    </Panel>);

}