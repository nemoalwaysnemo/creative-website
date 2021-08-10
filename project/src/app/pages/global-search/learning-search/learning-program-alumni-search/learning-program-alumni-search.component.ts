import { Component } from '@angular/core';
import { GlobalSearchParams, NuxeoRequestOptions } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService, SearchFilterModel } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';

@Component({
  selector: 'learning-program-alumni-search',
  styleUrls: ['./learning-program-alumni-search.component.scss'],
  templateUrl: './learning-program-alumni-search.component.html',
})
export class LearningProgramAlumniSearchComponent extends BaseDocumentViewComponent {

  defaultParams: any = {
    extractorName: 'collective-user-list',
    currentPageIndex: 0,
    pageSize: 24,
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'departments', placeholder: 'Discipline' }),
    new SearchFilterModel({ key: 'nominations', placeholder: 'GPL Program' }),
    new SearchFilterModel({ key: 'years', placeholder: 'Year' }),
    new SearchFilterModel({
      key: 'agencies', placeholder: 'Agency', optionModelFn: (agg: any) => {
        const list = agg.key.split(' - ');
        agg.label = list[0];
        agg.value = list[1];
        return agg;
      },
    }),
    new SearchFilterModel({ key: 'titles', placeholder: 'Role' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'remote-search-collective-user'],
    pageProvider: 'RemoteSearch',
    searchGroupPosition: 'middle',
    fulltextKey: 'queryParams',
    enableQueryParams: true,
  });

  beforeSearch: (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions) => { searchParams: GlobalSearchParams; opts: NuxeoRequestOptions } = (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions) => {
    if (searchParams.providerParams.hasFilters()) {
      const namedParameters = Object.assign({}, searchParams.providerParams.aggregates);
      for (const key in namedParameters) {
        if (Object.prototype.hasOwnProperty.call(namedParameters, key) && Array.isArray(namedParameters[key])) {
          namedParameters[key] = namedParameters[key].join(',');
        }
      }
      searchParams.mergeParams({ namedParameters });
    }
    return { searchParams, opts };
  };

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }
}
