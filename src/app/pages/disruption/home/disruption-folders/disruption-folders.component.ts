import { Component } from '@angular/core';
import { DocumentModel, AdvanceSearch } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { TAB_CONFIG } from '../../disruption-shared/tab-config';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'tbwa-disruption-folders',
  styleUrls: ['./disruption-folders.component.scss'],
  templateUrl: './disruption-folders.component.html',
})
export class DisruptionFoldersComponent extends AbstractDocumentViewComponent {

  tabs = TAB_CONFIG;

  baseParams$: Subject<any> = new Subject<any>();

  filters: any = {
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, queryParamsService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    this.baseParams$.next(this.buildAssetsParams(doc));
  }

  protected getDefaultDocumentParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
      quickFilters: 'ShowInNavigation',
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
    };
  }

  protected buildAssetsParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAY_TYPE,
      ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }
}
