import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdvanceSearchService, NuxeoPagination, DocumentModel, UserService, NuxeoPageProviderParams, UserModel } from '@core/api';
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

  constructor(private advanceSearchService: AdvanceSearchService, private userService: UserService) { }

  ngOnInit(): void {
    this.search(this.params);
    this.getMyAgency();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMyAgency(): void {
    const subscription = this.userService.getCurrentUserInfo()
      .subscribe((user: UserModel) => {
        if (user.get('companycode')) {
          this.myAgencyFlag = true;
        }
      });
    this.subscription.add(subscription);
  }

  private search(params: {}): void {
    const subscription = this.advanceSearchService.request(new NuxeoPageProviderParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }
}
