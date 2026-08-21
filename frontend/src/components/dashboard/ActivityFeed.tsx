import React from "react";
import { ClipboardCheckIcon, PackageIcon, TriangleAlertIcon, HardHatIcon, FileTextIcon, ReceiptIcon, CameraIcon, BoxIcon } from "lucide-react";
import { Panel, PanelHeader } from "../ui/Panel";
import { activityFeed } from "../../data/activity";
import { ActivityEvent } from "../../types";
const kindIcon: Record<ActivityEvent['kind'], {
  icon: BoxIcon;
  tone: string;
}> = {
  progress: {
    icon: ClipboardCheckIcon,
    tone: 'text-signal-green bg-signal-greenSoft'
  },
  material: {
    icon: PackageIcon,
    tone: 'text-safety-500 bg-safety-50'
  },
  issue: {
    icon: TriangleAlertIcon,
    tone: 'text-signal-red bg-signal-redSoft'
  },
  labour: {
    icon: HardHatIcon,
    tone: 'text-steel-600 bg-steel-50'
  },
  document: {
    icon: FileTextIcon,
    tone: 'text-signal-blue bg-signal-blueSoft'
  },
  expense: {
    icon: ReceiptIcon,
    tone: 'text-ink-700 bg-ink-100'
  },
  photo: {
    icon: CameraIcon,
    tone: 'text-steel-600 bg-steel-50'
  }
};
export function ActivityFeed() {
  return <Panel>
      <PanelHeader title="Recent site activity" subtitle="Live log from DPRs, stores and site teams" action={<span className="font-mono text-2xs text-ink-400">18 Aug 2026</span>} />
      <ol className="px-4 py-3">
        {activityFeed.map((event, index) => {
        const {
          icon: Icon,
          tone
        } = kindIcon[event.kind];
        const isLast = index === activityFeed.length - 1;
        return <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
              {!isLast && <span className="absolute left-3 top-7 h-[calc(100%-1.75rem)] w-px bg-ink-100" aria-hidden />}
              <span className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${tone}`}>
                <Icon className="h-3 w-3" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-snug text-ink-700">
                  <span className="font-semibold text-ink-900">{event.actor}</span>{' '}
                  <span className="text-ink-400">· {event.role}</span>
                </p>
                <p className="mt-0.5 text-xs leading-snug text-ink-600">{event.message}</p>
                <p className="mt-1 font-mono text-2xs text-ink-400">
                  {event.projectCode} · {event.time}
                </p>
              </div>
            </li>;
      })}
      </ol>
    </Panel>;
}