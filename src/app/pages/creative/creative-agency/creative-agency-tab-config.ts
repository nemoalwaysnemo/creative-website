import { DocumentModel, NuxeoPermission } from '@core/api';
import { UserPermission } from '@core/acl';
import { Observable } from 'rxjs';

export const TAB_CONFIG: any[] = [
  {
    title: 'Showcase',
    route: '/p/creative/agency/:id/showcase',
  },
  {
    title: 'Brands',
    route: '/p/creative/agency/:id/brand',
  },
  {
    title: 'Manage Library',
    route: '/p/creative/agency/:id/library',
    acl: [UserPermission.Mgt],
  },
  {
    title: 'Manage Lists',
    route: '/p/creative/agency/:id/list',
    aclFunc: (doc: DocumentModel): Observable<boolean> => doc.hasPermission(NuxeoPermission.Write),
  },
];
