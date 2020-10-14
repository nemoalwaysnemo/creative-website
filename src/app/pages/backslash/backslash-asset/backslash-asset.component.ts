import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { DocumentVideoEvent, DocumentVideoViewerService } from '../../shared/document-viewer/document-video-viewer/document-video-viewer.service';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-asset',
  styleUrls: ['./backslash-asset.component.scss'],
  templateUrl: './backslash-asset.component.html',
})
export class BackslashAssetComponent extends GlobalDocumentViewComponent implements AfterViewInit {

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
    private documentVideoViewerService: DocumentVideoViewerService,
  ) {
    super(activatedRoute, documentPageService);
  }

  ngAfterViewInit(): void {
    const subscription = this.documentVideoViewerService.onEvent('videoCanPlay').subscribe((event: DocumentVideoEvent) => {
      this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'playVideo' }));
    });
    this.subscription.add(subscription);
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
