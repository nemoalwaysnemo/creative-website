import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { PaginationDataSource } from 'app/pages/shared/pagination/pagination-data-source';
import { Subscription } from 'rxjs';

@Component({
  selector: 'disruption-roads-view',
  styleUrls: ['./disruption-roads-view.component.scss'],
  templateUrl: './disruption-roads-view.component.html',
})

export class DisruptionRoadsViewComponent implements OnInit, OnDestroy {
  @Input() nuxeoParams: any;
  @Input() disruptionType: any;
  loading: boolean = true;
  paginationService: PaginationDataSource = new PaginationDataSource();
  private subscription: Subscription = new Subscription();
  documents: DocumentModel[];
  constructor(private advanceSearch: AdvanceSearch) { }

  getThumbnailUrl(doc: DocumentModel): string {
    return doc.isAudio() && doc.type === 'App-Library-Audio' ? 'assets/images/no-thumbnail.png' : doc.thumbnailUrl;
  }
  ngOnInit() {
    this.search(this.nuxeoParams);
    const subscription = this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      this.search(Object.assign({}, this.nuxeoParams, pageInfo));
    });
    this.subscription.add(subscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
