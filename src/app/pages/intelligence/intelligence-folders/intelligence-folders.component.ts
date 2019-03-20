import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  NuxeoPagination, AdvanceSearch } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';
import { isDocumentUID } from '@core/services';

@Component({
  selector: 'tbwa-intelligence-folders',
  styleUrls: ['./intelligence-folders.component.scss'],
  templateUrl: './intelligence-folders.component.html',
})
export class IntelligenceFoldersComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  folderContents: any;
  redirectToIndusty: boolean;
  queryParams = this.activatedRoute.snapshot.queryParams;
  header: any;
  contentParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
    ecm_parentId: this.queryParams.id,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_INDUSTRY_TYPE,
  };

  assetParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
    app_edges_intelligence_category: `["${this.queryParams.folder_type}"]`,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
  };

  industryParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
    app_edges_industry_any: this.getIndustryString(this.queryParams.industry_type),
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
    this.checkFolderId(this.queryParams.id);
    this.judgeRedirects(this.queryParams.folder_type);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private checkFolderId(folderId: string) {
    if ( !isDocumentUID(folderId) ) {
      this.redirectTo404();
    }
  }

  private judgeRedirects(folderType: string) {
    this.header = folderType;
    if ( folderType === 'Industry' ) {
      this.redirectToIndusty = true;
      this.searchContents(this.contentParams);
    } else if ( folderType === 'Consumers' || folderType === 'Marketing' || folderType === 'Consumer') {
      this.searchAssets(this.assetParams);
    } else if ( folderType === 'industryAssets') {
      this.searchContents(this.industryParams);
    }
  }

  private searchContents(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.folderContents = res.entries;
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

  getIndustryString(industry) {
    if (industry) {
    const tempString = '["' + industry.join('", "') + '"]';
    return tempString;
    }
  }

  private redirectTo404(): void {
    this.router.navigate(['/404']);
  }
}
