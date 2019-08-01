import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-popular-brand-search',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-popular-brand-search.component.html',
})
export class CreativePopularBrandSearchComponent {

  defaultParams: any = {
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_SELECTED_BRAND_TYPE,
    currentPageIndex: 0,
    pageSize: 20,
    ecm_path: '',
    ecm_fulltext: '',
  };

  filters: any = {};

  currentView: string = 'thumbnailView';

  onResultViewChange(name: string): void {
    this.currentView = name;
  }

}
