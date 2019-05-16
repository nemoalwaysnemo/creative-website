import { NUXEO_META_INFO } from '@environment/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, AdvanceSearch, DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'disruption-home',
  styleUrls: ['./intelligence-home.component.scss'],
  templateUrl: './intelligence-home.component.html',
})
export class IntelligenceHomeComponent implements OnInit, OnDestroy {
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
    ecm_path: NUXEO_META_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
  };

  folderParams: any = {
    pageSize: 3,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_FOLDER_TYPE,
  };

  private backgroudParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.FRONTPAGE_BANNER_PATH,
    ecm_primaryType: NUXEO_META_INFO.FRONTPAGE_BANNER_TYPE,
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
        this.folders = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }

  private getBackgroud(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.document = res.entries.filter((doc: DocumentModel) => doc.title.toLowerCase().includes('intelligence')).shift();
      });
    this.subscription.add(subscription);
  }
}
