import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination, AdvanceSearch } from '@core/api';
import { takeWhile, tap, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../../shared/tab-config';
import { isDocumentUID } from '@core/services';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'tbwa-disruption-folders',
  styleUrls: ['./disruption-folders.component.scss'],
  templateUrl: './disruption-folders.component.html',
})
export class DisruptionFoldersComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  document: DocumentModel;
  folderContents: any;
  tabs = TAB_CONFIG;
  private subscription: Subscription = new Subscription();

  params: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: '/know-edge',
    ecm_uuid: `["${this.activatedRoute.queryParams['value'].id}"]`,
    quickFilters: 'ShowInNavigation',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
  };
  contentParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: '/know-edge',
    ecm_parentId: this.activatedRoute.queryParams['value'].id,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAY_TYPE,
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
    this.onQueryParamsChanged();
    this.searchContents(this.contentParams);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getThumbnailUrl(doc): string {
    return doc.isAudio() && doc.type === 'App-Library-Audio' ? 'assets/images/no-thumbnail.png' : doc.thumbnailUrl;
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

          this.document = doc;
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

  private searchContents(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.folderContents = res.entries;
      });
    this.subscription.add(subscription);
  }
}
