
export class GlobalSearchFormSettings {

  enableQueryParams: boolean = false;

  enableSearchInput: boolean = true;

  searchGroupPosition: string = 'left';

  buttonGroupPosition: string = 'left';

  placeholder: string = 'Search for...';

  pageProvider: string = 'creative_website_search';

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

}
