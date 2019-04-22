import { Component, OnInit } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { NuxeoPagination, AdvanceSearch } from '@core/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tbwa-home-page',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  backgroudDocument: any;

  headline: string = 'This is how we kill boring.';

  subHead: string = 'Our entire collection of disruptive work is all right here';

  placeholder: string = 'Search for campaigns by title, agency, brand, client...';

  private subscription: Subscription = new Subscription();

  params: any = {
    pageSize: 10,
    ecm_path: NUXEO_META_INFO.CREATIVE_BASE_FOLDER_PATH + 'TBWA-',
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  private backgroudParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.BACKGROUND_PATH,
    ecm_primaryType: NUXEO_META_INFO.BACKGROUND_TYPE,
  };

  constructor(private advanceSearch: AdvanceSearch) { }

  ngOnInit() {
    this.getBackgroud(this.backgroudParams);
  }

  private getBackgroud(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.backgroudDocument = res.entries[1];
      });
    this.subscription.add(subscription);
  }
}
