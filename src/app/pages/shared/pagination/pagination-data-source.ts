import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NuxeoPagination } from '@core/api';

export class PaginationDataSource {

  private onChangedSource = new Subject<any>();
  private pagination: NuxeoPagination = new NuxeoPagination();

  from(pagination: NuxeoPagination): void {
    this.pagination = pagination;
    this.emitOnChanged('load');
  }

  count(): number {
    return this.pagination.resultsCount;
  }

  onChanged(): Observable<any> {
    return this.onChangedSource.asObservable();
  }

  onPageChanged(): Observable<any> {
    return this.onChangedSource
      .pipe(
        filter(data => data.action === 'page'),
        map(data => { delete data.action; return data; }),
      );
  }

  get pagingInfo(): any {
    return { page: this.pagination.currentPageIndex + 1, perPage: this.pagination.pageSize, currentPageSize: this.pagination.currentPageSize, numberOfPages: this.pagination.numberOfPages };
  }

  setPage(page: number) {
    this.emitOnChanged('page', page);
  }

  private emitOnChanged(action: string, page: number = 0): void {
    this.onChangedSource.next({
      action: action,
      currentPageIndex: page,
    });
  }
}
