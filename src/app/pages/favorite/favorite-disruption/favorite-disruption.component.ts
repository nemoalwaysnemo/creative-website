import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, SearchFilterModel } from '@core/api';
import { GlobalDocumentDialogService, DocumentPageService, GlobalSearchFormSettings } from '@pages/shared';
import { BaseFavoriteDocumentViewComponent } from '../base-favorite-document-view.component';
import { TAB_CONFIG } from '../favorite-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'favorite-disruption',
  templateUrl: './favorite-disruption.component.html',
  styleUrls: ['./favorite-disruption.component.scss'],
})
export class FavoriteDisruptionComponent extends BaseFavoriteDocumentViewComponent {

  tabs: any[] = TAB_CONFIG;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
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
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE,
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
