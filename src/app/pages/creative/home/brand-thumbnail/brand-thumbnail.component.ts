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

  documentType = 'brand';

  loading: boolean = true;

  brandDocuments: DocumentModel[];

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 2,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPES,
    the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_BRAND_FOLDER_TYPE,
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
