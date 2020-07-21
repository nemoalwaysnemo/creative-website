import { Component } from '@angular/core';
import { DocumentModel, SearchFilterModel } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'knowledge-home',
  styleUrls: ['./knowledge-home.component.scss'],
  templateUrl: './knowledge-home.component.html',
})
export class KnowledgeHomeComponent extends BaseDocumentViewComponent {

  loading: boolean = true;

  headline: string = 'Welcome to the';

  subHead: string = 'Find insights, inspiration and creative work from around the collective.';

  folders: DocumentModel[] = [];

  filters: SearchFilterModel[] = [];

  defaultParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: '/',
    ecm_primaryType: NUXEO_DOC_TYPE.KNOWLEDGE_ASSET_TYPE,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search',
    enableQueryParams: false,
    skipAggregates: true,
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }

}
