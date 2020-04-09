import { UserPermission } from '@core/acl';

export const TAB_CONFIG: any[] = [
  {
    title: 'Assets',
    route: '/p/creative/brand/:id/asset',
  },
  {
    title: 'Showcase',
    route: '/p/creative/brand/:id/showcase',
  },
  {
    title: 'Usage Rights',
    route: '/p/creative/brand/:id/usageRights',
    acl: [UserPermission.Management],
  },
  {
    title: 'Campaigns',
    route: '/p/creative/brand/:id/campaign',
    acl: [UserPermission.Management],
  },
  {
    title: 'Projects',
    route: '/p/creative/brand/:id/project',
    acl: [UserPermission.Management],
  },
  {
    title: 'Manage Library',
    route: '/p/creative/brand/:id/library',
    acl: [UserPermission.Management],
  },
  {
    title: 'Manage Lists',
    route: '/p/creative/brand/:id/folder',
    acl: [UserPermission.Management],
  },
];
