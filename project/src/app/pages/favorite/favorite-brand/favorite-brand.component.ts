import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel } from '@core/api';
import { GlobalDocumentDialogService, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { BaseFavoriteDocumentViewComponent } from '../base-favorite-document-view.component';
import { TAB_CONFIG } from '../favorite-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'favorite-brand',
  templateUrl: './favorite-brand.component.html',
  styleUrls: ['./favorite-brand.component.scss'],
})
export class FavoriteBrandComponent extends BaseFavoriteDocumentViewComponent {

  tabs: any[] = TAB_CONFIG;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(activatedRoute, documentPageService, globalDocumentDialogService);
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    const params: any = {
      the_loupe_main_folder_type: NUXEO_DOC_TYPE.CREATIVE_BRAND_FOLDER_TYPE,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_FOLDER_TYPE,
      ecm_path: this.documentPageService.getConfig('path:CREATIVE_TBWA_FOLDER_PATH'),
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['collectionIds_any'] = `["${doc.uid}"]`;
    }
    return params;
  }

}
