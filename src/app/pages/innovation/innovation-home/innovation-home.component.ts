import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, AdvanceSearchService, DocumentModel, NuxeoPageProviderParams, SearchFilterModel } from '@core/api';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { TAB_CONFIG } from '../innovation-tab-config';
import { map } from 'rxjs/operators';
import { GlobalSearchFormSettings } from '@pages/shared';

@Component({
  selector: 'innovation-home',
  styleUrls: ['./innovation-home.component.scss'],
  templateUrl: './innovation-home.component.html',
})
export class InnovationHomeComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  tabs: any[] = TAB_CONFIG;

  loading: boolean = true;

  headline: string = 'Driving progress and change across our collective';

  extraHeadline: string;

  subHead: string = 'Material to help inspire and accelerate innovation';

  assetUrlMapping: object = {
    'App-BizDev-CaseStudy-Folder': '/p/business-development/Case Studies/folder',
    'App-BizDev-CaseStudy-Asset': '/p/business-development/Case Studies/folder/:parentRef/asset',
    'App-BizDev-Thought-Folder': '/p/business-development/Thought Leadership/folder',
    'App-BizDev-Thought-Asset': '/p/business-development/Thought Leadership/folder/:parentRef/asset',
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
    ecm_mixinType_not_in: '',
    ecm_path: NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_SEARCH_TYPE,
  };

  private subFolderParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_SUB_FOLDER_TYPES,
  };

  private baseFolderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    app_global_ext_app_iframe: true,
    ecm_path: NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_FOLDER_TYPE,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({ placeholder: 'Search for anything...', enableQueryParams: false });

  constructor(
    private advanceSearchService: AdvanceSearchService) {
  }

  ngOnInit(): void {
    this.performFolders();
  }

  ngOnDestroy(): void {
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
    return this.advanceSearchService.request(new NuxeoPageProviderParams(params)).pipe(
      map((res: NuxeoPagination) => res.entries.filter((doc: DocumentModel) => this.tabs.some(x => doc.title === x.title))),
    );
  }

}
