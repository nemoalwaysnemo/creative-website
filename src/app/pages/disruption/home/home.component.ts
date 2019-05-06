import { NUXEO_META_INFO } from '@environment/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, AdvanceSearch, DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';


@Component({
  selector: 'disruption-page',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  loading: boolean = true;
  headline = 'Find the knowledge in our network.';
  subHead = 'Get the info that brought the insight.';
  placeholder = 'Search for marketing reports, data, research...';
  document: DocumentModel;
  folders: any[];

  params: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.DISRUPTION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ASSET_TYPE,
  };

  folderParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.DISRUPTION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_FOLDER_TYPE,
  };

  private backgroudParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.BACKGROUND_PATH,
    ecm_primaryType: NUXEO_META_INFO.BACKGROUND_TYPE,
  };

  constructor(
    private advanceSearch: AdvanceSearch) {
  }

  ngOnInit() {
    this.search(this.folderParams);
    this.getBackgroud(this.backgroudParams);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private search(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.folders = res.entries.filter( x => x.path !== '/know-edge/Disruption' );
        this.loading = false;
      });
    this.subscription.add(subscription);
  }

  private getBackgroud(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.document = res.entries[2];
      });
    this.subscription.add(subscription);
  }

}
