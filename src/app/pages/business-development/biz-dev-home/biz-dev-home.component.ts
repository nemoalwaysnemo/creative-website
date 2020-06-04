import { Component } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { TAB_CONFIG } from '../business-development-tab-config';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { NuxeoPagination, DocumentModel, NuxeoPageProviderParams, SearchFilterModel } from '@core/api';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'biz-dev-home',
  styleUrls: ['./biz-dev-home.component.scss'],
  templateUrl: './biz-dev-home.component.html',
})
export class BizDevHomeComponent extends BaseDocumentViewComponent {

  tabs: any[] = TAB_CONFIG;

  loading: boolean = true;

  headline: string = 'Go get them, Tiger!';

  extraHeadline: string;

  subHead: string = 'Find everything you need to grow our business!';

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
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_SEARCH_TYPE,
  };

  private subFolderParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_SUB_FOLDER_TYPES,
  };

  private baseFolderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    app_global_ext_app_iframe: true,
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_FOLDER_TYPE,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search for anything...',
  });

  constructor(
    protected documentPageService: DocumentPageService,
  ) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
    this.performFolders();
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
    return this.documentPageService.advanceRequest(new NuxeoPageProviderParams(params)).pipe(
      map((res: NuxeoPagination) => res.entries.filter((doc: DocumentModel) => this.tabs.some(x => doc.title === x.title))),
    );
  }

}
