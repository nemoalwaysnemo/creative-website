import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, NuxeoPageProviderParams, UserModel } from '@core/api';
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

  hasAgency: boolean = false;

  companyCode: string;

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
    this.getMyAgency();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMyAgency(): void {
    const subscription = this.documentPageService.getCurrentUser()
      .subscribe((user: UserModel) => {
        if (user.companycode) {
          this.hasAgency = true;
        }
      });
    this.subscription.add(subscription);
  }

  private search(params: {}): void {
    const subscription = this.documentPageService.advanceRequest(new NuxeoPageProviderParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }
}
