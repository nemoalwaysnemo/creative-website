import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaginationDataSource } from '../../shared/pagination/pagination-data-source';

@Component({
  selector: 'tbwa-table-pagination',
  styleUrls: ['./pagination.component.scss'],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnChanges, OnInit {

  @Input() dataSource: PaginationDataSource;
  @Output() changePage = new EventEmitter<any>();

  private pages: any[] = [];
  private currentPage: number = 1;
  private totalPage: number = 0;
  private pageSize: number;

  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.subscription = this.dataSource.onChanged().subscribe(_ => {
      this.currentPage = this.dataSource.pagingInfo.page;
      this.pageSize = this.dataSource.pagingInfo.perPage;
      this.totalPage = this.dataSource.pagingInfo.numberOfPages;
      this.initPages();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.source) {
      if (!changes.source.firstChange) {
        this.subscription.unsubscribe();
      }
    }
  }

  shouldShow(): boolean {
    return this.dataSource.count() > this.pageSize;
  }

  paginate(page: number): boolean {
    this.currentPage = page;
    this.dataSource.setPage(page - 1);
    this.changePage.emit({ currentPageIndex: page - 1 });
    return false;
  }

  next(): boolean {
    return this.paginate(this.getPage() + 1);
  }

  prev(): boolean {
    return this.paginate(this.getPage() - 1);
  }

  getPage(): number {
    return this.currentPage;
  }

  getTotalPage(): number {
    return this.totalPage;
  }

  getPages(): Array<number> {
    return this.pages;
  }

  getLast(): number {
    return this.dataSource.pagingInfo.numberOfPages;
  }

  initPages() {
    if (this.shouldShow()) {
      this.pages = this.computePages(this.getPage(), this.getTotalPage());
    }
  }

  protected computePages(currentPage: number = 0, totalPages: number, listLength: number = 6): Array<any> {
    const offset = Math.ceil(listLength / 2);
    let start = currentPage - offset;
    let end = currentPage + offset;
    if (totalPages <= listLength) {
      start = 1;
      end = totalPages;
    } else if (currentPage <= offset) {
      start = 1;
      end = listLength + 1;
    } else if ((currentPage + offset) >= totalPages) {
      start = totalPages - listLength;
      end = totalPages;
    }
    return this.range(start, end);
  }

  private range(start: number, end: number, step: number = 0, offset: number = 0): Array<number> {
    const len = (Math.abs(end - start) + ((offset || 0) * 2)) / (step || 1) + 1;
    const direction = start < end ? 1 : -1;
    const startingPoint = start - (direction * (offset || 0));
    const stepSize = direction * (step || 1);
    return Array(len).fill(0).map(function (_, index) {
      return startingPoint + (stepSize * index);
    });
  }
}
