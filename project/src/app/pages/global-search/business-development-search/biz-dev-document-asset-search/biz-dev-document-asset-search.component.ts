import { Component } from '@angular/core';
import { GlobalSearchFormSettings, DocumentPageService, SearchFilterModel } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'biz-dev-document-asset-search',
  templateUrl: './biz-dev-document-asset-search.component.html',
})
export class BizDevDocumentAssetSearchComponent extends BaseDocumentViewComponent {

  defaultParams: any = {
    ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_SEARCH_TYPE,
    ecm_path: this.documentPageService.getConfig('path:BIZ_DEV_BASE_FOLDER_PATH'),
    ecm_mixinType_not_in: '',
    currentPageIndex: 0,
    ecm_fulltext: '',
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }
}
