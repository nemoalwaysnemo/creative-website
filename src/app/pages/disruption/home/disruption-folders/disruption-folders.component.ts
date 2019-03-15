import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination, AdvanceSearch } from '@core/api';
import { takeWhile, tap, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { PaginationDataSource } from 'app/pages/shared/pagination/pagination-data-source';
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
  paginationService: PaginationDataSource = new PaginationDataSource();
  tabs = TAB_CONFIG;
  private subscription: Subscription = new Subscription();
  pageType = 'folders';
  params: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
    ecm_uuid: `["${this.activatedRoute.queryParams['value'].id}"]`,
    quickFilters: 'ShowInNavigation',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
  };
  nuxeoParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
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
    this.searchFolders(this.params);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getThumbnailUrl(doc): string {
    return doc.isAudio() && doc.type === 'App-Library-Audio' ? 'assets/images/no-thumbnail.png' : doc.thumbnailUrl;
  }

  private searchFolders(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.document = res.entries[0];
      });
    this.subscription.add(subscription);
  }
}
