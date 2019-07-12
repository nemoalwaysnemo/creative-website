import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, AdvanceSearch, NuxeoPageProviderParams } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'disruption-home',
  styleUrls: ['./intelligence-home.component.scss'],
  templateUrl: './intelligence-home.component.html',
})
export class IntelligenceHomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  loading: boolean = true;
  headline = 'All brains on deck.';
  subHead = 'Before we disrupt, we do our homework.';
  placeholder = 'Search for marketing reports, data, research...';
  folders: any[];

  params: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
  };

  folderParams: any = {
    pageSize: 3,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_FOLDER_TYPE,
  };

  constructor(
    private advanceSearch: AdvanceSearch) {
  }

  ngOnInit() {
    this.search(this.folderParams);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private search(params: {}): void {
    const subscription = this.advanceSearch.request(new NuxeoPageProviderParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.folders = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }
}
