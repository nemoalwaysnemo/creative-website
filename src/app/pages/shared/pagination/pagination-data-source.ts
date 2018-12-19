import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { NuxeoPagination } from '@core/api';

export class PaginationDataSource {
  private onChangedSource = new Subject<any>();

  constructor(private pagination: NuxeoPagination) {
  }

  count(): number {
    return this.pagination.resultsCount;
  }

  onChanged(): Observable<any> {
    return this.onChangedSource.asObservable();
  }

  getPaging(): any {
    return { page: this.pagination.currentPageIndex, perPage: this.pagination.pageSize, currentPageSize: this.pagination.currentPageSize, numberOfPages: this.pagination.numberOfPages};
  }

  setPage(page: number, doEmit?: boolean) {
    if (doEmit) {
      this.emitOnChanged('page');
    }
  }

   private emitOnChanged(action: string) {
    this.onChangedSource.next({ action: action });
  }
}
