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
  private subscription: Subscription = new Subscription();
  backgroudParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.HOME_BACKGROUND_PATH,
    ecm_primaryType: NUXEO_META_INFO.BACKGROUND_TYPE,
  };
  backgroudDocument: any;
  ngOnInit() {
    this.getBackgroud(this.backgroudParams);
  }
  headline =  'Discover and find inspiring TBWA work';
  subHead = 'Over hundreds of curated work created by the TBWA network, all in one place.';
  constructor (private advanceSearch: AdvanceSearch) {}

  private getBackgroud(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
      this.backgroudDocument = res.entries[0];
      });
    this.subscription.add(subscription);
  }
}
