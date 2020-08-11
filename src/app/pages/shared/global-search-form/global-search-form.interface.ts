
export class GlobalSearchSettings {

  schemas?: string[];

  enableQueryParams: boolean = false;

  skipAggregates: boolean = false;

  showFilter: boolean = false;

  currentAsSearchParams: boolean = true; // true for current serach params, false for base search params

  syncFormValue: boolean = true;

  fulltextKey: string = 'ecm_fulltext';

  pageProvider: string = 'creative_website_search';

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export class GlobalSearchFormSettings extends GlobalSearchSettings {

  enableSearchInput: boolean = true;

  autofocus: boolean = false;

  searchGroupPosition: string = 'left';

  buttonGroupPosition: string = 'left';

  placeholder: string = 'Search for...';

  source: string = 'global-search-form';

  constructor(data: any = {}) {
    super(data);
    Object.assign(this, data);
  }
}
