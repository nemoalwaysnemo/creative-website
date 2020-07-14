import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, NuxeoPageProviderParams, UserModel } from '@core/api';
import { DocumentPageService } from '@pages/shared';
import { Subscription } from 'rxjs';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-agency-thumbnail',
  styleUrls: ['./agency-thumbnail.component.scss'],
  templateUrl: './agency-thumbnail.component.html',
})
export class AgencyThumbnailComponent implements OnInit, OnDestroy {

  layout: string = 'full-width agency';

  loading: boolean = true;

  documents: DocumentModel[];

  myAgencyFlag: boolean = false;

  companyCode: string;

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 9,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_BEST_ASSETS_PATH,
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
          this.myAgencyFlag = true;
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
