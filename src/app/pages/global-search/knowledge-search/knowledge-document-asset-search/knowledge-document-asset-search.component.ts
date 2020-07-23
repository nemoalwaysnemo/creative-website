import { Component } from '@angular/core';
import { SearchFilterModel } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'knowledge-document-asset-search',
  templateUrl: './knowledge-document-asset-search.component.html',
})
export class KnowledgeDocumentAssetSearchComponent extends BaseDocumentViewComponent {

  defaultParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: '/',
    ecm_fulltext: '',
    ecm_mixinType_not_in: '',
    ecm_primaryType: NUXEO_DOC_TYPE.KNOWLEDGE_ASSET_TYPE,
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
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
