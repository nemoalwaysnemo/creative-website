import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, AdvanceSearch, DocumentModel, NuxeoPageProviderParams, SearchFilterModel } from '@core/api';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { TAB_CONFIG } from '../business-development-tab-config';
import { map } from 'rxjs/operators';

@Component({
  selector: 'biz-dev-home',
  styleUrls: ['./biz-dev-home.component.scss'],
  templateUrl: './biz-dev-home.component.html',
})
export class BizDevHomeComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  tabs: any[] = TAB_CONFIG;

  loading: boolean = true;

  headline: string = 'Go get them, Tiger!';

  extraHeadline: string;

  subHead: string = 'Find everything you need to grow our business!';

  placeholder: string = 'Search for anything...';

  assetUrlMapping: object = {
    'App-BizDev-CaseStudy-Folder': '/p/business-development/Case Studies/folder',
    'App-BizDev-Thought-Folder': '/p/business-development/Thought Leadership/folder',
    '*': '/p/business-development/asset',
  };

  folders: DocumentModel[] = [];

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
  ];

  defaultParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_SEARCH_TYPE,
  };

  subFolderParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_SUB_FOLDER_TYPES,
  };

  baseFolderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    app_global_ext_app_iframe: true,
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_FOLDER_TYPE,
  };

  constructor(
    private advanceSearch: AdvanceSearch) {
  }

  ngOnInit() {
    this.performFolders();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private performFolders(): void {
    forkJoin(
      this.search(this.subFolderParams),
      this.search(this.baseFolderParams),
    ).pipe(
      map((docsList: DocumentModel[][]) => [].concat.apply([], docsList)),
    ).subscribe((docs: DocumentModel[]) => {
      this.folders = docs;
      this.loading = false;
    });
  }

  private search(params: {}): Observable<DocumentModel[]> {
    return this.advanceSearch.request(new NuxeoPageProviderParams(params)).pipe(
      map((res: NuxeoPagination) => res.entries.filter((doc: DocumentModel) => this.tabs.some(x => doc.title === x.title))),
    );
  }

}
