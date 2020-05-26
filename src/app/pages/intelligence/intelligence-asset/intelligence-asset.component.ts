import { Component } from '@angular/core';
import { AdvanceSearchService } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { GlobalDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'intelligence-asset',
  styleUrls: ['./intelligence-asset.component.scss'],
  templateUrl: './intelligence-asset.component.html',
})
export class IntelligenceAssetComponent extends GlobalDocumentViewComponent {

  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearchService, activatedRoute, queryParamsService);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.KNOWEDGE_BASIC_PATH,
      ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
    };
  }

}
