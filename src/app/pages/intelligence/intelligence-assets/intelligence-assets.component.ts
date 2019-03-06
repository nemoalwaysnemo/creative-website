import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination, AdvanceSearch } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';
@Component({
  selector: 'tbwa-intelligence-assets',
  styleUrls: ['./intelligence-assets.component.scss'],
  templateUrl: './intelligence-assets.component.html',
})
export class IntelligenceAssetsComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  asset: any;
  redirectToIndusty: boolean;
  assetParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: '/know-edge',
    ecm_uuid: `["${this.activatedRoute.queryParams['value'].id}"]`,
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
    this.searchAssets(this.assetParams);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  private searchAssets(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.asset = res.entries[0];
      });
    this.subscription.add(subscription);
  }
}
