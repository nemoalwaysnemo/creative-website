import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, AdvanceSearch, DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'creative-home-page',
  styleUrls: ['./creative-home.component.scss'],
  templateUrl: './creative-home.component.html',
})
export class CreativeHomeComponent implements OnInit, OnDestroy {

  document: DocumentModel;

  headline: string = 'This is how we kill boring.';

  subHead: string = 'Our entire collection of disruptive work is all right here.';

  placeholder: string = 'Search for campaigns by title, agency, brand, client...';

  private subscription: Subscription = new Subscription();

  params: any = {
    pageSize: 10,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH + 'TBWA-',
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  private backgroudParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.FRONTPAGE_BANNER_PATH,
    ecm_primaryType: NUXEO_META_INFO.FRONTPAGE_BANNER_TYPE,
  };

  constructor(private advanceSearch: AdvanceSearch) { }

  ngOnInit() {
    this.getBackgroud(this.backgroudParams);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getBackgroud(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.document = res.entries.filter((doc: DocumentModel) => doc.title.toLowerCase().includes('creative')).shift();
      });
    this.subscription.add(subscription);
  }
}
