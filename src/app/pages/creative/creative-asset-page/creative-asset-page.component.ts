import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvanceSearchService } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-asset-page',
  styleUrls: ['./creative-asset-page.component.scss'],
  templateUrl: './creative-asset-page.component.html',
})
export class CreativeAssetPageComponent extends GlobalDocumentViewComponent {

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
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    };
  }

  hasReleatedBrands(): boolean {
    const brands = this.document.get('The_Loupe_Main:brand');
    return brands && brands.length > 0;
  }

  hasReleatedAgency(): boolean {
    const agency = this.document.get('The_Loupe_Main:agency');
    return agency !== '' || agency !== null;
  }

}
