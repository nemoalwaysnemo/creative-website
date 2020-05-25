import { Component } from '@angular/core';
import { SearchFilterModel } from '@core/api';
import { GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'biz-dev-document-asset-search',
  templateUrl: './biz-dev-document-asset-search.component.html',
})
export class BizDevDocumentAssetSearchComponent {

  defaultParams: any = {
    ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_SEARCH_TYPE,
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
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
