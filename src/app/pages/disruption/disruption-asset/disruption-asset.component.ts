import { Component } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'disruption-asset',
  styleUrls: ['./disruption-asset.component.scss'],
  templateUrl: './disruption-asset.component.html',
})
export class DisruptionAssetComponent extends AbstractDocumentViewComponent {

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
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ASSET_TYPE,
    };
  }

}
