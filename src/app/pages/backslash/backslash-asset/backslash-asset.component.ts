import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-asset',
  styleUrls: ['./backslash-asset.component.scss'],
  templateUrl: './backslash-asset.component.html',
})
export class BackslashAssetComponent extends GlobalDocumentViewComponent {

  mute: boolean = true;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onPageInit(): void {
    this.mute = this.documentPageService.isFirstVisitPage();
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_TYPES,
    };
  }

}
