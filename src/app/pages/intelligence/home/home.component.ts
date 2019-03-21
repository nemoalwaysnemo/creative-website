import { NUXEO_META_INFO } from '@environment/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NuxeoPagination, AdvanceSearch } from '@core/api';
import { Subscription } from 'rxjs';


@Component({
  selector: 'tbwa-disruption-page',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  headline = 'Find the knowledge in our network.';
  subHead = 'Get the info that brought the insight.';
  placeholder = 'Search for marketing reports, data, research...';
  backgroudDocument: any;
  folders: any;
  params: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_FOLDER_TYPE,
  };
  private backgroudParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.BACKGROUND_PATH,
    ecm_primaryType: NUXEO_META_INFO.BACKGROUND_TYPE,
  };
  constructor(
    private router: Router,
    private advanceSearch: AdvanceSearch) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.search(this.params);
    this.getBackgroud(this.backgroudParams);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private search(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        const industryFolders = [];
        for (const entry of res.entries) {
          industryFolders.push({ url: entry.filePath, title: entry.title, uid: entry.uid });
        }
        this.folders = industryFolders;
      });
    this.subscription.add(subscription);
  }

  private getBackgroud(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.backgroudDocument = res.entries[0];
      });
    this.subscription.add(subscription);
  }
}
