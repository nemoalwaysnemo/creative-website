import { DocumentModel, GlobalSearchParams, NuxeoPagination } from '@core/api';
import { DocumentPageService } from '../shared/services/document-page.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NUXEO_DOC_TYPE } from '@environment/environment';

export const TAB_CONFIG: any[] = [
  {
    title: 'DisruptionX',
    route: '/p/disruption/DisruptionX',
    aclFn: (doc: DocumentModel, documentPageService: DocumentPageService): Observable<boolean> => {
      return documentPageService.advanceRequest(new GlobalSearchParams({
        pageSize: 1,
        currentPageIndex: 0,
        ecm_path_eq: documentPageService.getConfig('path:DISRUPTION_X_FOLDER_PATH'),
        ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_X_FOLDER_TYPE,
      })).pipe(
        map((res: NuxeoPagination) => res.entries.shift()),
        map((d: DocumentModel) => d && d.get('app_global:enable_feature') === true),
      );
    },
  },
  {
    title: 'Disruption Roadmaps',
    route: '/p/disruption/Disruption Roadmaps',
  },
  {
    title: 'Disruption Days',
    route: '/p/disruption/Disruption Days',
  },
  {
    title: 'Disruption How Tos',
    route: '/p/disruption/Disruption How Tos',
  },
  {
    title: 'Things to Steal',
    route: '/p/disruption/Things to Steal',
  },
];
