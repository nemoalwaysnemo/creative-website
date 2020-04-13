import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, AdvanceSearch, UserService, SearchFilterModel } from '@core/api';
import { PreviewDialogService, SearchQueryParamsService } from '@pages/shared';
import { AbstractFavoriteDocumentViewComponent } from '../abstract-favorite-document-view.component';
import { NUXEO_META_INFO, NUXEO_PATH_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../favorite-tab-config';

@Component({
  selector: 'favorite-backslash',
  templateUrl: './favorite-backslash.component.html',
  styleUrls: ['./favorite-backslash.component.scss'],
})
export class FavoriteBackslashComponent extends AbstractFavoriteDocumentViewComponent {

  tabs: any[] = TAB_CONFIG;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
  ];

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    protected previewDialogService: PreviewDialogService,
    protected userService: UserService) {
    super(advanceSearch, activatedRoute, queryParamsService, previewDialogService, userService);
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
