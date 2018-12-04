export class Document {
  constructor(
    public uuid: string,
    public xpath: string,
    public title: string) {
  }
}

export const defaultAPIResponse: any = {
  entityType: null,
  entity: {},
  entities: [],
  errorMessage: {},
  resultsCount: 0,
  pageSize: 0,
  currentPageSize: 0,
  currentPageIndex: 0,
  numberOfPages: 0,
};

export class APIResponse {
  private entityType: string;
  private entity: any;
  private entities: any;
  private resultsCount: number;
  private pageSize: number;
  private currentPageSize: number;
  private currentPageIndex: number;
  private numberOfPages: number;

  constructor(response?: any) {
    this.entityType = response.entity_type;
    this.entity = response.entity || {};
    this.entities = response.entities || [];
    this.resultsCount = response.resultsCount || 0;
    this.pageSize = response.pageSize || 0;
    this.currentPageSize = response.currentPageSize || 0;
    this.currentPageIndex = response.currentPageIndex || 0;
    this.numberOfPages = response.numberOfPages || 0;
  }

  getEntityType(): string {
    return this.entityType;
  }

  getEntity(): any {
    return this.entity;
  }

  getEntities(): any {
    return this.entities;
  }

  getResultsCount(): number {
    return this.resultsCount;
  }

  getPageSize(): number {
    return this.pageSize;
  }

  getCurrentPageSize(): number {
    return this.currentPageSize;
  }

  getCurrentPageIndex(): number {
    return this.currentPageIndex;
  }

  getNumberOfPages(): number {
    return this.numberOfPages;
  }
}
