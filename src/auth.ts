import type { Role } from './types'

export type Permission =
  | 'view_dashboards'
  | 'view_event_dictionary'
  | 'manage_event_dictionary'
  | 'view_alerts'
  | 'manage_alerts'
  | 'manage_members'
  | 'view_audit'
  | 'export_data'

const RolePerms: Record<Role, Permission[]> = {
  Owner: [
    'view_dashboards',
    'view_event_dictionary',
    'manage_event_dictionary',
    'view_alerts',
    'manage_alerts',
    'manage_members',
    'view_audit',
    'export_data',
  ],
  Admin: [
    'view_dashboards',
    'view_event_dictionary',
    'manage_event_dictionary',
    'view_alerts',
    'manage_alerts',
    'manage_members',
    'view_audit',
    'export_data',
  ],
  Analyst: ['view_dashboards', 'view_event_dictionary', 'view_alerts', 'view_audit', 'export_data'],
  Marketer: ['view_dashboards', 'view_event_dictionary', 'view_alerts', 'export_data'],
  Viewer: ['view_dashboards', 'view_event_dictionary', 'view_alerts'],
}

export function hasPerm(role: Role, perm: Permission) {
  return RolePerms[role].includes(perm)
}
