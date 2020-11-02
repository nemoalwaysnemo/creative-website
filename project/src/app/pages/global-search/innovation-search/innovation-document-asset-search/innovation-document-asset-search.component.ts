import { Component } from '@angular/core';
import { SearchFilterModel } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'innovation-document-asset-search',
  templateUrl: './innovation-document-asset-search.component.html',
})
export class InnovationDocumentAssetSearchComponent extends BaseDocumentViewComponent {

  defaultParams: any = {
    ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_SEARCH_TYPE,
    ecm_path: NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH,
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
