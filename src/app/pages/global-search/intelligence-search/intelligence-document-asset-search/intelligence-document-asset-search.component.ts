import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-intelligence-document-asset-search',
  templateUrl: './intelligence-document-asset-search.component.html',
})
export class IntelligenceDocumentAssetSearchComponent {

  defaultParams: any = {
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
    ecm_path: NUXEO_META_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
  };

  filters: any = {
    'app_edges_industry_agg': { placeholder: 'Industry' },
    'app_edges_tags_edges_agg': { placeholder: 'Edges' },
  };
}
