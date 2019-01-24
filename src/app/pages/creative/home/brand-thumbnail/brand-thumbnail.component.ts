import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tbwa-brand-thumbnail',
  styleUrls: ['./brand-thumbnail.component.scss'],
  templateUrl: './brand-thumbnail.component.html',
})
export class BrandThumbnailComponent implements OnInit, OnDestroy {

  layout = 'brand';

  loading: boolean = true;

  brandDocuments: DocumentModel[];

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 2,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  constructor(private advanceSearch: AdvanceSearch) { }

  ngOnInit() {
    this.subscription = this.advanceSearch.request(this.params)
      .subscribe((res: NuxeoPagination) => {
        this.brandDocuments = res.entries;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
