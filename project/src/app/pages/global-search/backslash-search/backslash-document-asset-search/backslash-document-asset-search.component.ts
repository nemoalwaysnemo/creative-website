import { Component } from '@angular/core';
import { DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-document-asset-search',
  styleUrls: ['./backslash-document-asset-search.component.scss'],
  templateUrl: './backslash-document-asset-search.component.html',
})
export class BackslashDocumentAssetSearchComponent extends BaseDocumentViewComponent {

  resultHeader: string;

  thumbnailViewSettings: any = {
    layout: 's-results my_agency dates full-width backslash_asset_search',
  };

  defaultParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    app_edges_active_article: true,
    ecm_path: this.documentPageService.getConfig('path:BACKSLASH_BASE_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ASSET_TYPE,
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    new SearchFilterModel({ key: 'app_edges_backslash_type_agg', placeholder: 'Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Agency Country', iteration: true }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }
}
