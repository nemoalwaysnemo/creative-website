import { Component } from '@angular/core';
import { SearchFilterModel } from '@core/api';
import { GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'intelligence-document-asset-search',
  templateUrl: './intelligence-document-asset-search.component.html',
})
export class IntelligenceDocumentAssetSearchComponent {

  defaultParams: any = {
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
    ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_intelligence_type_agg', placeholder: 'Intelligence Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Backslash Category' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });
}
