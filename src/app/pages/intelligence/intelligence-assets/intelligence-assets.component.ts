import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination, AdvanceSearch } from '@core/api';
import { takeWhile, tap, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { NUXEO_META_INFO } from '@environment/environment';
import { isDocumentUID } from '@core/services';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'tbwa-intelligence-assets',
  styleUrls: ['./intelligence-assets.component.scss'],
  templateUrl: './intelligence-assets.component.html',
})
export class IntelligenceAssetsComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  loading: boolean = true;
  document: DocumentModel;
  asset: any;
  redirectToIndusty: boolean;
  params: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
    ecm_uuid: `["${this.activatedRoute.queryParams['value'].id}"]`,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
  };
  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
    ecm_uuid: `["${this.activatedRoute.queryParams['value'].folder}"]`,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_INDUSTRY_TYPE,
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private advanceSearch: AdvanceSearch) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }
  // ngOnInit() {
  //   this.searchAssets(this.assetParams);
  // }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
  // private searchAssets(params: {}): void {
  //   const subscription = this.advanceSearch.request(params)
  //     .subscribe((res: NuxeoPagination) => {
  //       this.asset = res.entries[0];
  //     });
  //   this.subscription.add(subscription);
  // }

  ngOnInit() {
    this.onQueryParamsChanged();
    this.searchFolders(this.folderParams);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  private getCurrentDocument(uid: string): Observable<NuxeoPagination> {
    const queryParams = Object.assign({}, this.params, { ecm_uuid: `["${uid}"]` });
    return this.advanceSearch.request(queryParams);
  }

  private onQueryParamsChanged(): void {
    const subscription = this.activatedRoute.queryParams
      .pipe(
        tap(queryParams => {
          if (!isDocumentUID(queryParams.id)) {
            this.redirectTo404();
          }
        }),
        takeWhile(queryParams => isDocumentUID(queryParams.id)),
        distinctUntilChanged(),
        map(queryParams => queryParams.id),
        switchMap((uid: string) => this.getCurrentDocument(uid)),
        map((res: NuxeoPagination) => res.entries.shift()),
      )
      .subscribe((doc: DocumentModel) => {
        if (doc) {
          this.asset = doc;
          this.loading = false;
        } else {
          this.redirectTo404();
        }
      });
    this.subscription.add(subscription);
  }

  private redirectTo404(): void {
    this.router.navigate(['/p/error/404']);
  }

  private searchFolders(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.document = res.entries[0];
      });
    this.subscription.add(subscription);
  }
}
