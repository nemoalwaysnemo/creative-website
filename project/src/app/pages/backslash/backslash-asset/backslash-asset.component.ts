import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-asset',
  styleUrls: ['./backslash-asset.component.scss'],
  templateUrl: './backslash-asset.component.html',
})
export class BackslashAssetComponent extends GlobalDocumentViewComponent {

  viewerSettings: any = {
    mute: true,
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onPageInit(): void {
    this.viewerSettings.mute = this.documentPageService.isFirstVisitPage();
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: this.documentPageService.getConfig('path:BACKSLASH_BASE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_POST_TYPES,
    };
  }

}
