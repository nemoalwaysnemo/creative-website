import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel } from '@core/api';
import { GlobalDocumentDialogService, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { BaseFavoriteDocumentViewComponent } from '../base-favorite-document-view.component';
import { TAB_CONFIG } from '../favorite-tab-config';

@Component({
  selector: 'all-favorites',
  templateUrl: './all-favorites.component.html',
  styleUrls: ['./all-favorites.component.scss'],
})
export class AllFavoritesComponent extends BaseFavoriteDocumentViewComponent {

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
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_path: '',
    };
    if (doc) {
      params['collectionIds_any'] = `["${doc.uid}"]`;
    }
    return params;
  }
}
