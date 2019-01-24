import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { PaginationDataSource } from '../../shared/pagination/pagination-data-source';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tbwa-agency-thumbnail',
  styleUrls: ['./agency-thumbnail.component.scss'],
  templateUrl: './agency-thumbnail.component.html',
})
export class AgencyThumbnailComponent implements OnInit, OnDestroy {

  layout = 'agency';

  loading: boolean = true;

  agencyDocuments: DocumentModel[];

  paginationService: PaginationDataSource = new PaginationDataSource();

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 8,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  constructor(private advanceSearch: AdvanceSearch) { }

  ngOnInit() {
    this.search(this.params);
    const subscription = this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      this.search(Object.assign({}, this.params, pageInfo));
    });
    this.subscription.add(subscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private search(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.agencyDocuments = res.entries;
        this.loading = false;
        this.paginationService.from(res);
      });
    this.subscription.add(subscription);
  }
}
