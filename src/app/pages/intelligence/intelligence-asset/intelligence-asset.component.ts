import { Component } from '@angular/core';
import { AdvanceSearchService } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'intelligence-asset',
  styleUrls: ['./intelligence-asset.component.scss'],
  templateUrl: './intelligence-asset.component.html',
})
export class IntelligenceAssetComponent extends GlobalDocumentViewComponent {

  enableThumbnailCreation: boolean = true;

  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService) {
    super(advanceSearchService, activatedRoute, documentPageService);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.KNOWEDGE_BASIC_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE,
    };
  }

}
