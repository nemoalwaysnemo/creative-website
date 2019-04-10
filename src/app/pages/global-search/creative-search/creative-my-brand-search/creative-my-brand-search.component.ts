import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-creative-my-brand-search',
  styleUrls: ['./creative-my-brand-search.component.scss'],
  templateUrl: './creative-my-brand-search.component.html',
})
export class CreativeMyBrandSearchComponent {

  defaultParams: any = {
    the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_BRAND_FOLDER_TYPE,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPES,
    currentPageIndex: 0,
    pageSize: 20,
    ecm_path: '',
    ecm_fulltext: '',
  };

  filters: any = {};

}
