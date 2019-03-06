import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  NuxeoPagination, AdvanceSearch } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tbwa-intelligence-folders',
  styleUrls: ['./intelligence-folders.component.scss'],
  templateUrl: './intelligence-folders.component.html',
})
export class IntelligenceFoldersComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  folderContents: any;
  redirectToIndusty: boolean;

  contentParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: '/know-edge',
    ecm_parentId: this.activatedRoute.queryParams['value'].id,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_INDUSTRY_TYPE,
  };

  assetParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: '/know-edge',
    app_edges_intelligence_category: `["${this.activatedRoute.queryParams['value'].folder_type}"]`,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
  };

  industryParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: '/know-edge',
    app_Edges_industry: `["${this.activatedRoute.queryParams['value'].folder_type}"]`,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
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
    if ( this.activatedRoute.queryParams['value'].folder_type === 'Industry' ) {
      this.redirectToIndusty = true;
      this.searchContents(this.contentParams);
    } else if ( this.activatedRoute.queryParams['value'].folder_type === 'Consumer' ||
    this.activatedRoute.queryParams['value'].folder_type === 'Marketing') {
      this.searchAssets(this.assetParams);
    } else {
      this.searchContents(this.industryParams);
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private searchContents(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.folderContents = res.entries;
        console.info(this.folderContents);
      });
    this.subscription.add(subscription);
  }

  private searchAssets(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.folderContents = res.entries;
      });
    this.subscription.add(subscription);
  }
}
