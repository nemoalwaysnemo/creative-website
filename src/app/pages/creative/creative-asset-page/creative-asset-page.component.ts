import { Component } from '@angular/core';
import { AdvanceSearch, NuxeoEnricher } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'creative-asset-page',
  styleUrls: ['./creative-asset-page.component.scss'],
  templateUrl: './creative-asset-page.component.html',
})
export class CreativeAssetPageComponent extends AbstractDocumentViewComponent {

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
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
