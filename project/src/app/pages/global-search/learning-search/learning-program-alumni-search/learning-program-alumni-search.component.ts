import { Component } from '@angular/core';
import { GlobalSearchFormSettings, DocumentPageService, SearchFilterModel } from '@pages/shared';
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
    new SearchFilterModel({ key: 'nominations', placeholder: 'GPL Program' }),
    new SearchFilterModel({ key: 'years', placeholder: 'Year' }),
    new SearchFilterModel({ key: 'agencies', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'titles', placeholder: 'Role' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'remote-search-collective-user'],
    pageProvider: 'RemoteSearch',
    searchGroupPosition: 'middle',
    fulltextKey: 'queryParams',
    enableQueryParams: true,
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }
}
