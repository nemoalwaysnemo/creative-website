import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, AdvanceSearchService } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'creative-popular-brand-thumbnail',
  styleUrls: ['./popular-brand-thumbnail.component.scss'],
  templateUrl: './popular-brand-thumbnail.component.html',
})
export class PopularBrandThumbnailComponent implements OnInit, OnDestroy {

  layout: string = 'full-width popular_brand';

  loading: boolean = true;

  documents: DocumentModel[];

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 3,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_SELECTED_BRAND_TYPE,
  };

  constructor(private advanceSearchService: AdvanceSearchService) { }

  ngOnInit(): void {
    this.subscription = this.advanceSearchService.request(this.params)
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
