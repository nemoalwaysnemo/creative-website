import { OnInit, OnDestroy } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { AbstractDocumentViewComponent } from './abstract-document-view.component';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';

export abstract class AbstractDocumentManageComponent extends AbstractDocumentViewComponent {

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPES,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_AGENCY_AND_BRAND_FOLDER_TYPE,
    };
  }

}
