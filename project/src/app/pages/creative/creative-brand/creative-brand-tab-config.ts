import { DocumentModel, NuxeoPermission } from '@core/api';
import { UserPermission } from '@core/acl';
import { Observable } from 'rxjs';

export const TAB_CONFIG: any[] = [
  {
    title: 'Showcase',
    route: '/p/creative/brand/:id/showcase',
  },
  {
    title: 'Assets',
    route: '/p/creative/brand/:id/asset',
  },
  {
    title: 'Usage Rights',
    route: '/p/creative/brand/:id/usage rights',
    acl: [UserPermission.Mgt],
  },
  {
    title: 'Campaigns & Projects',
    route: '/p/creative/brand/:id/campaign summary',
    acl: [UserPermission.Mgt],
  },
  // {
  //   title: 'Campaigns',
  //   route: '/p/creative/brand/:id/campaign',
  //   acl: [UserPermission.Mgt],
  // },
  // {
  //   title: 'Projects',
  //   route: '/p/creative/brand/:id/project',
  //   acl: [UserPermission.Mgt],
  // },
  {
    title: 'Manage Library',
    route: '/p/creative/brand/:id/library',
    acl: [UserPermission.Mgt],
  },
  {
    title: 'Manage Listings',
    route: '/p/creative/brand/:id/list',
    aclFn: (doc: DocumentModel): Observable<boolean> => doc.hasPermission(NuxeoPermission.Write),
  },
];
