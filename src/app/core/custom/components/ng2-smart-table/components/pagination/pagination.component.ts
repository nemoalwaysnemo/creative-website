import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { range } from '../../lib/helpers';

import { DataSource } from '../../lib/data-source/data-source';

@Component({
  selector: 'ng2-smart-table-pagination',
  styleUrls: ['./pagination.component.scss'],
  template: `
    <nav *ngIf="shouldShow()" class="ng2-smart-pagination-nav">
      <ul class="ng2-smart-pagination pagination">
        <li class="ng2-smart-page-item page-item" [ngClass]="{disabled: getPage() == 1}">
          <a class="ng2-smart-page-link page-link" href="#"
          (click)="getPage() == 1 ? false : paginate(1)" aria-label="First">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">First</span>
          </a>
        </li>
        <li class="ng2-smart-page-item page-item" [ngClass]="{disabled: getPage() == 1}">
          <a class="ng2-smart-page-link page-link page-link-prev" href="#"
             (click)="getPage() == 1 ? false : prev()" aria-label="Prev">
            <span aria-hidden="true">&lt;</span>
            <span class="sr-only">Prev</span>
          </a>
        </li>
        <li class="ng2-smart-page-item page-item"
        [ngClass]="{active: getPage() == page}" *ngFor="let page of getPages()">
          <span class="ng2-smart-page-link page-link"
          *ngIf="getPage() == page">{{ page }} <span class="sr-only">(current)</span></span>
          <a class="ng2-smart-page-link page-link" href="#"
          (click)="paginate(page)" *ngIf="getPage() != page">{{ page }}</a>
        </li>

        <li class="ng2-smart-page-item page-item"
            [ngClass]="{disabled: getPage() == getLast()}">
          <a class="ng2-smart-page-link page-link page-link-next" href="#"
             (click)="getPage() == getLast() ? false : next()" aria-label="Next">
            <span aria-hidden="true">&gt;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>

        <li class="ng2-smart-page-item page-item"
        [ngClass]="{disabled: getPage() == getLast()}">
          <a class="ng2-smart-page-link page-link" href="#"
          (click)="getPage() == getLast() ? false : paginate(getLast())" aria-label="Last">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Last</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
})
export class PaginationComponent implements OnChanges {

  @Input() source: DataSource;

  @Output() changePage = new EventEmitter<any>();

  protected pages: Array<any> = [];
  protected currentPage: number = 1;
  protected totalPage: number = 0;
  protected pageSize: number;

  protected dataChangedSub: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.source) {
      if (!changes.source.firstChange) {
        this.dataChangedSub.unsubscribe();
      }
      this.dataChangedSub = this.source.onChanged().subscribe((dataChanges) => {
        this.currentPage = this.source.getPaging().page;
        this.pageSize = this.source.getPaging().perPage;
        this.totalPage = this.source.getPaging().numberOfPages;
        this.initPages();
      });
    }
  }

  shouldShow(): boolean {
    return this.source.count() > this.pageSize;
  }

  paginate(page: number): boolean {
    this.source.setPage(page);
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
    return this.source.getPaging().numberOfPages;
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
    return range(start, end);
  }

}
