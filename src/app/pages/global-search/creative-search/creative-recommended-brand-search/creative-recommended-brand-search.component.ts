import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-creative-recommended-brand-search',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-recommended-brand-search.component.html',
})
export class CreativeRecommendedBrandSearchComponent {

  defaultParams: any = {
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_SELECTED_BRAND_TYPE,
    currentPageIndex: 0,
    pageSize: 20,
    ecm_path: '',
    ecm_fulltext: '',
  };

  filters: any = {};

}
