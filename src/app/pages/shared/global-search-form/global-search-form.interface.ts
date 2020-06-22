
export class GlobalSearchSettings {

  fulltextKey: string = 'ecm_fulltext';

  source: string = 'global-search-form';

  pageProvider: string = 'creative_website_search';

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export class GlobalSearchFormSettings extends GlobalSearchSettings {

  enableQueryParams: boolean = false;

  enableSearchInput: boolean = true;

  showFilter: boolean = false;

  autoSearch: boolean = true;

  searchGroupPosition: string = 'left';

  buttonGroupPosition: string = 'left';

  placeholder: string = 'Search for...';

}
