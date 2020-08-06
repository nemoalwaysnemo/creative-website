import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NuxeoPagination } from '@core/api';

export class PaginationDataSource {

  private event: Subject<any> = new Subject<any>();

  private resultsCount: number = 0;

  from(pagination: NuxeoPagination): void {
    this.resultsCount = pagination.resultsCount;
    this.triggerEvent('load', { currentPageIndex: pagination.currentPageIndex, totalPage: pagination.numberOfPages, pageSize: pagination.pageSize });
  }

  totalSize(): number {
    return this.resultsCount;
  }

  onChanged(): Observable<any> {
    return this.event;
  }

  onPageChanged(): Observable<any> {
    return this.event
      .pipe(
        filter((data: any) => data.action === 'page'),
        map((data: any) => { delete data.action; return data; }),
      );
  }

  changePage(currentPageIndex: number): void {
    this.triggerEvent('page', { currentPageIndex });
  }

  private triggerEvent(action: string, opts: any = {}): void {
    this.event.next(Object.assign({}, { action }, opts));
  }
}
