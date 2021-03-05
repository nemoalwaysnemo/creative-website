import { UserPermission } from '@core/acl';

export const TAB_CONFIG: any[] = [
  {
    title: 'Content',
    route: '/p/backslash/home',
  },
  {
    title: 'Edges',
    route: '/p/backslash/edge',
  },
  {
    title: 'Resources',
    route: '/p/backslash/resource',
  },
  {
    title: 'Reports',
    route: '/p/backslash/report',
    activeFn: (url: string) => url.includes('/p/backslash/category') || url.includes('/p/backslash/report') || url.includes('/p/backslash/region'),
  },
  {
    title: 'Trigger Pool',
    route: '/p/backslash/Trigger Pool',
    acl: [UserPermission.Mgt],
  },
];
