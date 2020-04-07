import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel, UserService, NuxeoPageProviderParams, UserModel } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'backslash-home-thumbnail',
  styleUrls: ['./backslash-home-thumbnail.component.scss'],
  templateUrl: './backslash-home-thumbnail.component.html',
})
export class BackslashHomeThumbnailComponent implements OnInit, OnDestroy {

  layout: string = 'full-width agency';

  loading: boolean = true;

  documents: DocumentModel[];

  myAgencyFlag: boolean = false;

  companyCode: string;

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 9,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_BEST_ASSETS_PATH,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  constructor(private advanceSearch: AdvanceSearch, private userService: UserService) { }

  ngOnInit() {
    this.search(this.params);
    this.getMyAgency();
  }

  ngOnDestroy() {
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
    const subscription = this.advanceSearch.request(new NuxeoPageProviderParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }
}
