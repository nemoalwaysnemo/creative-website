import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tbwa-recommend-brand-thumbnail',
  styleUrls: ['./recommend-brand-thumbnail.component.scss'],
  templateUrl: './recommend-brand-thumbnail.component.html',
})
export class RecommendedBrandThumbnailComponent implements OnInit, OnDestroy {

  layout = 'recommendedBrand';

  loading: boolean = true;

  documents: DocumentModel[];

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 3,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_SELECTED_BRAND_TYPE,
  };

  constructor(private advanceSearch: AdvanceSearch) { }

  ngOnInit() {
    this.subscription = this.advanceSearch.request(this.params)
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
