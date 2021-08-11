import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'intelligence-asset',
  styleUrls: ['./intelligence-asset.component.scss'],
  templateUrl: './intelligence-asset.component.html',
})
export class IntelligenceAssetComponent extends GlobalDocumentViewComponent {

  enableThumbnailCreation: boolean = true;

  viewerSettings: any = {
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: this.documentPageService.getConfig('path:KNOWEDGE_BASIC_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE,
    };
  }

}
