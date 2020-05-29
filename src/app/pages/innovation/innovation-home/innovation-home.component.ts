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
    'App-Innovation-Folder': this.documentMap,
    'App-Innovation-Asset': this.documentMap,
    '*': '/p/innovation/asset',
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
    ecm_primaryType: NUXEO_META_INFO.INNOVATION_SEARCH_TYPE,
  };

  private baseFolderParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_mixinType_not_in: '',
    ecm_path: NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.INNOVATION_FOLDER_TYPE,
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
    this.advanceSearchService.request(new NuxeoPageProviderParams(this.baseFolderParams)).pipe(
      map((res: NuxeoPagination) => {
        const docs = [];
        this.tabs.forEach(x => {
          docs.push(res.entries.find(doc => doc.title === x.title));
        });
        return docs;
      }),
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

  documentMap(doc: DocumentModel): string {
    let url;
    if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + '/NEXT')) {
      url = '/p/innovation/NEXT/folder';
    } else if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + '/Things to Steal')) {
      url = '/p/innovation/Things to Steal/folder';
    }
    if (doc.type === 'App-Innovation-Asset') {
      url = url + '/:parentRef/asset';
    }
    return url;
  }
}
