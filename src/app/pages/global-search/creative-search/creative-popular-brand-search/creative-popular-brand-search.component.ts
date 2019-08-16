import { Component } from '@angular/core';
import { NUXEO_META_INFO, NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'creative-popular-brand-search',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-popular-brand-search.component.html',
})
export class CreativePopularBrandSearchComponent {

  defaultParams: any = {
    ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_SELECTED_BRAND_TYPE,
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
  };

  filters: any = {};

  currentView: string = 'thumbnailView';

  onResultViewChange(name: string): void {
    this.currentView = name;
  }

}
