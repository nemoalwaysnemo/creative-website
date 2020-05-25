import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, AdvanceSearch, UserService, SearchFilterModel } from '@core/api';
import { GlobalDocumentDialogService, SearchQueryParamsService, GlobalSearchFormSettings } from '@pages/shared';
import { BaseFavoriteDocumentViewComponent } from '../base-favorite-document-view.component';
import { NUXEO_META_INFO, NUXEO_PATH_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../favorite-tab-config';

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
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected userService: UserService) {
    super(advanceSearch, activatedRoute, queryParamsService, globalDocumentDialogService, userService);
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.BACKSLASH_ARTICLE_VIDEO_TYPES,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
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
