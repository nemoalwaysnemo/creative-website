import { Component } from '@angular/core';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'disruption-document-asset-search',
  templateUrl: './disruption-document-asset-search.component.html',
})
export class DisruptionDocumentAssetSearchComponent {

  defaultParams: any = {
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ASSET_TYPE,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_BASE_FOLDER_PATH,
    ecm_mixinType_not_in: '', // override
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
  };

  filters: any = {
    'the_loupe_main_brand_agg': { placeholder: 'Brand' },
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'the_loupe_main_country_agg': { placeholder: 'County', iteration: true },
    'app_edges_industry_agg': { placeholder: 'Industry', iteration: true },
    'app_edges_tags_edges_agg': { placeholder: 'Edges' },
  };
}
