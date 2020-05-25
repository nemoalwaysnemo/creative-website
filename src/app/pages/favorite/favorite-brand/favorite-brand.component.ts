import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, AdvanceSearch, UserService, SearchFilterModel } from '@core/api';
import { GlobalDocumentDialogService, SearchQueryParamsService, GlobalSearchFormSettings } from '@pages/shared';
import { AbstractFavoriteDocumentViewComponent } from '../abstract-favorite-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../favorite-tab-config';

@Component({
  selector: 'favorite-brand',
  templateUrl: './favorite-brand.component.html',
  styleUrls: ['./favorite-brand.component.scss'],
})
export class FavoriteBrandComponent extends AbstractFavoriteDocumentViewComponent {

  tabs: any[] = TAB_CONFIG;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected userService: UserService) {
    super(advanceSearch, activatedRoute, queryParamsService, globalDocumentDialogService, userService);
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    const params = {
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_BRAND_FOLDER_TYPE,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPE,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['collectionIds_any'] = `["${doc.uid}"]`;
    }
    return params;
  }

}
