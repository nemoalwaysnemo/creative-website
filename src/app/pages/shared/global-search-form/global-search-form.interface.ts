
export class GlobalSearchFormSettings {

  enableQueryParams: boolean = true;

  enableSearchInput: boolean = true;

  searchGroupPosition: string = 'left';

  buttonGroupPosition: string = 'left';

  placeholder: string = 'Search for...';

  pageProvider: string = 'creative_website_search';

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

}
