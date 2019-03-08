import { NUXEO_META_INFO } from '@environment/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NuxeoPagination, AdvanceSearch } from '@core/api';
import { Subscription } from 'rxjs';


@Component({
  selector: 'tbwa-disruption-page',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  headline = 'What are you looking for today?';
  folders: any;
  params: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: '/know-edge',
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_FOLDER_TYPE,
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private advanceSearch: AdvanceSearch) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.search(this.params);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private search(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        const industryFolders = [];
        for (const key in res.entries)  {
          industryFolders.push( { url: res.entries[key]['thumbnailUrl'], title: res.entries[key]['title'], uid: res.entries[key]['uid'] } );
      }
      this.folders = industryFolders;
      });
    this.subscription.add(subscription);
  }
}
