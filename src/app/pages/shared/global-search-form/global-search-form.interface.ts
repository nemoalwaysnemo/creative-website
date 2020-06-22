
export class GlobalSearchSettings {

  syncFormValue: boolean = true;

  fulltextKey: string = 'ecm_fulltext';

  pageProvider: string = 'creative_website_search';

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export class GlobalSearchFormSettings extends GlobalSearchSettings {

  enableQueryParams: boolean = false;

  enableSearchInput: boolean = true;

  showFilter: boolean = false;

  searchGroupPosition: string = 'left';

  buttonGroupPosition: string = 'left';

  placeholder: string = 'Search for...';

  source: string = 'global-search-form';

  constructor(data: any = {}) {
    super(data);
    Object.assign(this, data);
  }
}
