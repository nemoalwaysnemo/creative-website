import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, AdvanceSearch, UserService, SearchFilterModel } from '@core/api';
import { GlobalDocumentDialogService, SearchQueryParamsService, GlobalSearchFormSettings } from '@pages/shared';
import { AbstractFavoriteDocumentViewComponent } from '../abstract-favorite-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../favorite-tab-config';

@Component({
  selector: 'favorite-disruption',
  templateUrl: './favorite-disruption.component.html',
  styleUrls: ['./favorite-disruption.component.scss'],
})
export class FavoriteDisruptionComponent extends AbstractFavoriteDocumentViewComponent {

  tabs: any[] = TAB_CONFIG;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
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
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_BASE_FOLDER_PATH,
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
