import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel, NuxeoPageProviderParams } from '@core/api';
import { PaginationDataSource } from 'app/pages/shared/pagination/pagination-data-source';
import { SearchQueryParamsService } from 'app/pages/shared';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'disruption-thumbnail-view',
  styleUrls: ['./disruption-thumbnail-view.component.scss'],
  templateUrl: './disruption-thumbnail-view.component.html',
})

export class DisruptionThumbnailViewComponent implements OnInit, OnDestroy {
  @Input() nuxeoParams: any;
  @Input() hasSearched: boolean = true;
  @Input() pageType: any;
  folderId: any;
  loading: boolean = true;
  paginationService: PaginationDataSource = new PaginationDataSource();
  private subscription: Subscription = new Subscription();
  documents: DocumentModel[];
  queryParams: NuxeoPageProviderParams = {};

  constructor(private advanceSearch: AdvanceSearch,
              private queryParamsService: SearchQueryParamsService,
              private activatedRoute: ActivatedRoute) { }

  getThumbnailUrl(doc: DocumentModel): string {
    return doc.isAudio() && doc.type === 'App-Library-Audio' ? 'assets/images/no-thumbnail.png' : doc.thumbnailUrl;
  }

  ngOnInit() {
    this.folderId = this.activatedRoute.snapshot.queryParams.id;
    this.search(this.nuxeoParams);
    this.onSearch();
    this.onPageChanged();
  }

  private onSearch(): void {
    const subscription = this.advanceSearch.onSearch().subscribe(({ response, queryParams, action }) => {
      if (action === 'beforeSearch') {
        this.loading = true;
        this.queryParams = this.nuxeoParams;
      } else if (this.hasSearched) {
        this.loading = false;
        this.paginationService.from(response);
        this.documents = response.entries;
      }
    });
    this.subscription.add(subscription);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private onPageChanged() {
    const subscription = this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      const currentPageIndex = pageInfo.currentPageIndex;
      this.queryParamsService.changeQueryParams([], { currentPageIndex }, 'merge');
    });
    this.subscription.add(subscription);
  }
  private search(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
        this.paginationService.from(res);
      });
    this.subscription.add(subscription);
  }
}
