import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { SearchFilterModel } from '../../../global-search-filter/global-search-filter.interface';

export class ProjectMgtNavigationSettings {

  searchFormParams: any = {};

  searchFormFilters: SearchFilterModel[] = [];

  searchFormSettings: GlobalSearchFormSettings;

  constructor(data: any = {}) {
    data.searchFormParams && (this.searchFormParams = data.searchFormParams);
    data.searchFormFilters && (this.searchFormFilters = data.searchFormFilters);
    data.searchFormSettings && (this.searchFormSettings = data.searchFormSettings);
  }

}
