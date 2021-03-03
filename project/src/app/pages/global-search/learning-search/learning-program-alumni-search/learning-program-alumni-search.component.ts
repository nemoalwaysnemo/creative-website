import { Component } from '@angular/core';
import { SearchFilterModel } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';

@Component({
  selector: 'learning-program-alumni-search',
  styleUrls: ['./learning-program-alumni-search.component.scss'],
  templateUrl: './learning-program-alumni-search.component.html',
})
export class LearningProgramAlumniSearchComponent extends BaseDocumentViewComponent {

  defaultParams: any = {
    currentPageIndex: 0,
    pageSize: 24,
  };

  filters: SearchFilterModel[] = [
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'remote-search-collective-user'],
    pageProvider: 'RemoteSearch',
    enableQueryParams: true,
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }
}
