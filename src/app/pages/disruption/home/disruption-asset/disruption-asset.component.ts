import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination, AdvanceSearch } from '@core/api';
import { takeWhile, tap, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../../disruption-shared/tab-config';
import { isDocumentUID } from '@core/services';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'tbwa-disruption-asset',
  styleUrls: ['./disruption-asset.component.scss'],
  templateUrl: './disruption-asset.component.html',
})
export class DisruptionAssetComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  document: DocumentModel;
  asset: DocumentModel;
  tabs = TAB_CONFIG;
  private subscription: Subscription = new Subscription();

  params: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
    ecm_uuid: `["${this.activatedRoute.queryParams['value'].id}"]`,
    // quickFilters: 'ShowInNavigation',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAY_TYPE,
  };

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
    ecm_uuid: `["${this.activatedRoute.queryParams['value'].folder}"]`,
    quickFilters: 'ShowInNavigation',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private advanceSearch: AdvanceSearch) {
  }

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