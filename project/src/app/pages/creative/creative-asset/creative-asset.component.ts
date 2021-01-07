import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { NuxeoRequestOptions } from '@core/api';

@Component({
  selector: 'creative-asset',
  styleUrls: ['./creative-asset.component.scss'],
  templateUrl: './creative-asset.component.html',
})
export class CreativeAssetComponent extends GlobalDocumentViewComponent {

  enableThumbnailCreation: boolean = true;

  viewerSettings: any = {
    styleName: 'creative-asset',
    enableGlobalMute: true,
    mute: true,
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
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    };
  }

  protected getCurrentDocumentRequestParams(): NuxeoRequestOptions {
    const options = new NuxeoRequestOptions();
    options.addSchemas('The_Loupe_Credits');
    return options;
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
