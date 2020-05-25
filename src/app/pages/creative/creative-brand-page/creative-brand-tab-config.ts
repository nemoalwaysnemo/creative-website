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
    route: '/p/creative/brand/:id/usage rights',
    acl: [UserPermission.Mgt],
  },
  {
    title: 'Campaigns',
    route: '/p/creative/brand/:id/campaign summary',
    acl: [UserPermission.Dev],
  },
  {
    title: 'Campaigns',
    route: '/p/creative/brand/:id/campaign',
    acl: [UserPermission.Mgt],
  },
  {
    title: 'Projects',
    route: '/p/creative/brand/:id/project',
    acl: [UserPermission.Mgt],
  },
  {
    title: 'Manage Library',
    route: '/p/creative/brand/:id/library',
    acl: [UserPermission.Mgt],
  },
  {
    title: 'Manage Lists',
    route: '/p/creative/brand/:id/folder',
    acl: [UserPermission.Mgt],
  },
];
