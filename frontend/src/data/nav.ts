import {
  LayoutDashboard as LayoutDashboardIcon,
  Building2 as Building2Icon,
  ListChecks as ListChecksIcon,
  Package as PackageIcon,
  HardHat as HardHatIcon,
  Receipt as ReceiptIcon,
  AlertTriangle as TriangleAlertIcon,
  FileBarChart2 as FileBarChart2Icon,
  FolderOpen as FolderOpenIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: 'critical' | 'warning' | 'neutral';
}

export const primaryNav: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboardIcon },
  { label: 'Projects', to: '/projects', icon: Building2Icon, badge: '5', badgeTone: 'neutral' },
  { label: 'Tasks', to: '/tasks', icon: ListChecksIcon, badge: '5', badgeTone: 'warning' },
  { label: 'Materials', to: '/materials', icon: PackageIcon, badge: '3', badgeTone: 'critical' },
  { label: 'Labour', to: '/labour', icon: HardHatIcon },
  { label: 'Expenses', to: '/expenses', icon: ReceiptIcon, badge: '2', badgeTone: 'warning' },
  { label: 'Issues', to: '/issues', icon: TriangleAlertIcon, badge: '7', badgeTone: 'critical' },
  { label: 'Reports', to: '/reports', icon: FileBarChart2Icon },
  { label: 'Documents', to: '/documents', icon: FolderOpenIcon },
];

export const secondaryNav: NavItem[] = [
  { label: 'Settings', to: '/settings', icon: SettingsIcon },
];