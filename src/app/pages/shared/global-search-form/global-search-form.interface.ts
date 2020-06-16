
export class GlobalSearchFormSettings {

  enableQueryParams: boolean = false;

  enableSearchInput: boolean = true;

  showFilter: boolean = false;

  searchGroupPosition: string = 'left';

  buttonGroupPosition: string = 'left';

  source: string = 'global-search-form';

  placeholder: string = 'Search for...';

  pageProvider: string = 'creative_website_search';

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

}
