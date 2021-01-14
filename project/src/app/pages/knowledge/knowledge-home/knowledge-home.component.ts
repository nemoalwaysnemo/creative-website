import { Component } from '@angular/core';
import { DocumentModel, SearchFilterModel } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';

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
    ecm_path: '/',
    ecm_fulltext: '',
    ecm_mixinType_not_in: '',
    condition: ' AND ((app_global:networkshare = true AND ecm:primaryType IN ("App-Library-Image", "App-Library-Video", "App-Library-Audio")) OR ecm:primaryType IN ("App-Backslash-Article", "App-Backslash-Video", "App-Intelligence-Asset", "App-Innovation-Asset", "App-BizDev-CaseStudy-Asset", "App-BizDev-Thought-Asset", "App-Disruption-Asset", "App-Disruption-Roadmap-Asset", "App-Disruption-Theory-Asset", "App-Disruption-Day-Asset", "App-Backslash-Case-Study", "App-Backslash-Edges-Asset", "App-Backslash-Resources-Asset", "App-DisruptionX-Module"))',
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
