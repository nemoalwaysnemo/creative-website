import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel } from '@core/api';
import { GlobalDocumentDialogService, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { BaseFavoriteDocumentViewComponent } from '../base-favorite-document-view.component';
import { TAB_CONFIG } from '../favorite-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'favorite-backslash',
  templateUrl: './favorite-backslash.component.html',
  styleUrls: ['./favorite-backslash.component.scss'],
})
export class FavoriteBackslashComponent extends BaseFavoriteDocumentViewComponent {

  tabs: any[] = TAB_CONFIG;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
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
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ASSET_TYPE,
      ecm_path: this.documentPageService.getConfig('path:BACKSLASH_BASE_FOLDER_PATH'),
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['collectionIds_any'] = `["${doc.uid}"]`;
    }
    return params;
  }

}
