import { UserPermission } from '@core/acl';

export const TAB_CONFIG: any[] = [
  {
    title: 'Brands',
    route: '/p/creative/agency/:id/asset',
  },
  {
    title: 'Showcase',
    route: '/p/creative/agency/:id/showcase',
  },
  {
    title: 'Manage Library',
    route: '/p/creative/agency/:id/library',
    acl: [UserPermission.Mgt],
  },
  {
    title: 'Manage Lists',
    route: '/p/creative/agency/:id/folder',
    acl: [UserPermission.Mgt],
  },
];
