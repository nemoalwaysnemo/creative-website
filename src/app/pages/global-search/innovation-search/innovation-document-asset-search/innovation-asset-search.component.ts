import { Component } from '@angular/core';
import { SearchFilterModel } from '@core/api';
import { GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'innovation-asset-search',
  templateUrl: './innovation-asset-search.component.html',
})
export class InnovationAssetSearchComponent {

  defaultParams: any = {
    ecm_primaryType: NUXEO_META_INFO.INNOVATION_SEARCH_TYPE,
    ecm_path: NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH,
    ecm_mixinType_not_in: '',
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

}
