import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { takeWhile, filter, mergeMap } from 'rxjs/operators';
import { DocumentModel, AdvanceSearch, NuxeoPagination } from '@core/api';
import { DocumentRelatedInfoService } from '../document-related-info.service';

@Component({
  selector: 'tbwa-document-related-info-view',
  styleUrls: ['./document-related-info-view.component.scss'],
  templateUrl: './document-related-info-view.component.html',
})
export class DocumentRelatedInfoViewComponent implements OnInit, OnDestroy {

  @Input() item: any = {};

  private alive = true;

  private documentRelatedInfoServiceRef: Subscription;

  private search$: Subject<any> = new Subject<any>();

  loading = true;

  documents: DocumentModel[] = [];

  queryField: FormControl = new FormControl();

  constructor(
    private advanceSearch: AdvanceSearch,
    private documentRelatedInfoService: DocumentRelatedInfoService) { }

  ngOnInit() {
    this.onSearch();
    this.onChangeTab();
  }

  ngOnDestroy() {
    this.alive = false;
    this.search$.unsubscribe();
    this.documentRelatedInfoServiceRef.unsubscribe();
  }

  onKeyup(event: KeyboardEvent) {
    if (this.alive) {
      this.loading = true;
      this.search$.next(this.getSearchParams());
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  private onChangeTab(): void {
    this.documentRelatedInfoServiceRef = this.documentRelatedInfoService.onChangeTab()
      .pipe(
        takeWhile(() => this.alive),
        filter((tabItem) => tabItem.name === this.item.name),
      )
      .subscribe(() => {
        if (this.documents.length === 0) {
          this.search$.next(this.getSearchParams());
        }
      });
  }

  private getSearchParams() {
    return Object.assign({ ecm_fulltext: this.queryField.value }, this.item.params);
  }

  private onSearch(): void {
    this.search$.pipe(
      mergeMap((params) => this.advanceSearch.request(params)),
    ).subscribe((res: NuxeoPagination) => {
      this.loading = false;
      this.documents = res.entries;
    });
  }

}
