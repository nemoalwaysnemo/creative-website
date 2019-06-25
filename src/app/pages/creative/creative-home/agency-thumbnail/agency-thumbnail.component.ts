import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'creative-agency-thumbnail',
  styleUrls: ['./agency-thumbnail.component.scss'],
  templateUrl: './agency-thumbnail.component.html',
})
export class AgencyThumbnailComponent implements OnInit, OnDestroy {

  layout: string = 'third full-width';

  loading: boolean = true;

  documents: DocumentModel[];

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 8,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_BEST_ASSETS_PATH,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  constructor(private advanceSearch: AdvanceSearch) { }

  ngOnInit() {
    this.search(this.params);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private search(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }
}
