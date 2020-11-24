import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, GlobalSearchParams } from '@core/api';
import { DocumentPageService } from '@pages/shared';
import { Subscription } from 'rxjs';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-best-showcase',
  styleUrls: ['./creative-best-showcase.component.scss'],
  templateUrl: './creative-best-showcase.component.html',
})
export class CreativeBestShowcaseComponent implements OnInit, OnDestroy {

  layout: string = 'full-width agency';

  documents: DocumentModel[];

  loading: boolean = true;

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 9,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_SHOWCASE_ASSET_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  constructor(
    protected documentPageService: DocumentPageService,
  ) {
  }

  ngOnInit(): void {
    this.search(this.params);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private search(params: {}): void {
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }
}
