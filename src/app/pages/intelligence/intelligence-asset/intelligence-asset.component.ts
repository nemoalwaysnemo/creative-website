import { Component } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'intelligence-asset',
  styleUrls: ['./intelligence-asset.component.scss'],
  templateUrl: './intelligence-asset.component.html',
})
export class IntelligenceAssetComponent extends AbstractDocumentViewComponent {

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected getDefaultDocumentParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
      ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
    };
  }

}
