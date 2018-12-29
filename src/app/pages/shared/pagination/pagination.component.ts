import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaginationDataSource } from '@pages/shared/pagination/pagination-data-source';

@Component({
  selector: 'tbwa-table-pagination',
  styleUrls: ['./pagination.component.scss'],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnChanges, OnInit {

  @Input() dataSource: PaginationDataSource;
  @Output() changePage = new EventEmitter<any>();

  constructor() {
  }

  private pages: any[] = [];
  private currentPage: number = 1;
  private totalPage: number = 0;
  private pageSize: number;

  private dataChangedSub: Subscription;

  ngOnInit() {
    this.dataChangedSub = this.dataSource.onChanged().subscribe((dataChanges) => {
      this.currentPage = this.dataSource.getPaging().page;
      this.pageSize = this.dataSource.getPaging().perPage;
      this.totalPage = this.dataSource.getPaging().numberOfPages;
      this.initPages();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.source) {
      if (!changes.source.firstChange) {
        this.dataChangedSub.unsubscribe();
      }
    }
  }

  shouldShow(): boolean {
    return this.dataSource.count() > this.pageSize;
  }

  paginate(page: number): boolean {
    this.dataSource.setPage(page);
    this.currentPage = page;
    this.changePage.emit({ page });
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
    return this.dataSource.getPaging().numberOfPages;
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

  private range(start: number, end: number, step: number = 0, offset: number = 0): Array<any> {
    const len = (Math.abs(end - start) + ((offset || 0) * 2)) / (step || 1) + 1;
    const direction = start < end ? 1 : -1;
    const startingPoint = start - (direction * (offset || 0));
    const stepSize = direction * (step || 1);
    return Array(len).fill(0).map(function (_, index) {
      return startingPoint + (stepSize * index);
    });
  }
}
