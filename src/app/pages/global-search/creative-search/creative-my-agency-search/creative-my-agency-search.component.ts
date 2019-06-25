import { Component, OnInit } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-my-agency-search',
  templateUrl: './creative-my-agency-search.component.html',
  styleUrls: ['./creative-my-agency-search.component.scss'],
})
export class CreativeMyAgencySearchComponent {

  defaultParams: any = {
    the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_BRAND_FOLDER_TYPE,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPES,
    currentPageIndex: 0,
    pageSize: 20,
    ecm_path: '',
    ecm_fulltext: '',
  };

  filters: any = {};

  showInput: boolean = false;

}
