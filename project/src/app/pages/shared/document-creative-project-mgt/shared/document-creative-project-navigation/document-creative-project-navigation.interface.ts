import { DocumentModel } from '@core/api';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { SearchFilterModel } from '../../../global-search-filter/global-search-filter.interface';

export class ProjectMgtNavigationSettings {

  currentPage: string;

  searchFormParams: any = {};

  selectedDocuments: DocumentModel[] = [];

  searchFormFilters: SearchFilterModel[] = [];

  searchFormSettings: GlobalSearchFormSettings;

  constructor(data: any = {}) {
    data.currentPage && (this.currentPage = data.currentPage);
    data.searchFormParams && (this.searchFormParams = data.searchFormParams);
    data.searchFormFilters && (this.searchFormFilters = data.searchFormFilters);
    data.searchFormSettings && (this.searchFormSettings = data.searchFormSettings);
  }

}
