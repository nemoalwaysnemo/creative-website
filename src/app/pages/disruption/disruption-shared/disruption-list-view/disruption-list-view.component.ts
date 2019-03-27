import { Component, Input, OnInit, OnDestroy, TemplateRef} from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel, NuxeoPageProviderParams} from '@core/api';
import { PaginationDataSource } from 'app/pages/shared/pagination/pagination-data-source';
import { SearchQueryParamsService } from 'app/pages/shared';
import { Subscription } from 'rxjs';
import { PreviewDialogService } from 'app/pages/shared/preview-dialog/preview-dialog.service';
@Component({
  selector: 'disruption-list-view',
  styleUrls: ['./disruption-list-view.component.scss'],
  templateUrl: './disruption-list-view.component.html',
})

export class DisruptionListViewComponent implements OnInit, OnDestroy {
  @Input() nuxeoParams: any;
  /* view for roadmaps, theory, thinking */
  @Input() disruptionType: any;

  loading: boolean = true;
  paginationService: PaginationDataSource = new PaginationDataSource();
  documents: DocumentModel[];
  queryParams: NuxeoPageProviderParams = {};
  private subscription: Subscription = new Subscription();
  constructor(private advanceSearch: AdvanceSearch, private queryParamsService: SearchQueryParamsService, private dialogService: PreviewDialogService) { }

  open(dialog: TemplateRef<any>, doc: DocumentModel) {
    const title = this.disruptionType;
    this.dialogService.open(dialog, doc, {title});
  }

  ngOnInit() {
    this.search(this.nuxeoParams);
    this.onSearch();
    this.onPageChanged();
  }

  private onSearch(): void {
    const subscription = this.advanceSearch.onSearch().subscribe(({ response, queryParams, action }) => {
      if (action === 'beforeSearch') {
        this.loading = true;
        this.queryParams = this.nuxeoParams;
      } else {
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
