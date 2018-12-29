import { Subject, Observable } from 'rxjs';
import { NuxeoPagination } from '@core/api';

export class PaginationDataSource {
  private onChangedSource = new Subject<any>();
  pagination: NuxeoPagination = new NuxeoPagination();
  protected data: Array<any> = [];

  constructor() {}

  from(pagination: NuxeoPagination): Promise<any> {
    this.pagination = pagination;
    this.data = pagination.entries;
    return this.load(this.data);
  }

  count(): number {
    return this.pagination.resultsCount;
  }

  onChanged(): Observable<any> {
    return this.onChangedSource.asObservable();
  }

  getAll(): Promise<any> {
    const data = this.data.slice(0);
    return Promise.resolve(data);
  }

  getPaging(): any {
    return { page: this.pagination.currentPageIndex + 1, perPage: this.pagination.pageSize, currentPageSize: this.pagination.currentPageSize, numberOfPages: this.pagination.numberOfPages};
  }

  setPage(page: number, doEmit?: boolean) {
    if (doEmit) {
      this.emitOnChanged('page');
    }
  }

   private emitOnChanged(action: string) {
     this.getAll().then((elements) => this.onChangedSource.next({
       action: action,
       elements: elements,
       paging: this.getPaging(),
     }));
  }

  load(data: Array<any>): Promise<any> {
    this.emitOnChanged('load');
    return Promise.resolve();
  }
}
