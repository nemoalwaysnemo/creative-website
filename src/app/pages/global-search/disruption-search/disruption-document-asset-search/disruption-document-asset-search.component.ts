import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'disruption-document-asset-search',
  templateUrl: './disruption-document-asset-search.component.html',
})
export class DisruptionDocumentAssetSearchComponent {

  defaultParams: any = {
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ASSET_TYPE,
    ecm_path: NUXEO_META_INFO.DISRUPTION_BASE_FOLDER_PATH,
    quickFilters: '',
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
  };

  filters: any = {
    'app_edges_industry_agg': { placeholder: 'Industry' },
    'app_edges_tags_edges_agg': { placeholder: 'Edges' },
  };
}
