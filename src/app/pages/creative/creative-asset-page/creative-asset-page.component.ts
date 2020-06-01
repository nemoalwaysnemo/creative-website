import { Component } from '@angular/core';
import { AdvanceSearchService, NuxeoEnricher } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { GlobalDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';

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
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearchService, activatedRoute, queryParamsService);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
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
