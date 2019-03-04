import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { PaginationDataSource } from '../../shared/pagination/pagination-data-source';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tbwa-document-related-agency',
  styleUrls: ['./document-related-agency.component.scss'],
  templateUrl: './document-related-agency.component.html',
})
export class DocumentRelatedAgencyComponent implements OnInit, OnDestroy {

  @Input() document: DocumentModel;

  layout = 'agency';

  loading: boolean = true;

  relatedAgencyDocuments: DocumentModel[];

  paginationService: PaginationDataSource = new PaginationDataSource();

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 4,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  constructor(private advanceSearch: AdvanceSearch) { }

  ngOnInit() {
    this.search(this.params);
    const subscription = this.paginationService.onPageChanged()
      .subscribe((pageInfo: any) => {
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
        this.loading = false;
        this.relatedAgencyDocuments = res.entries;
        this.paginationService.from(res);
      });
    this.subscription.add(subscription);
  }
}
