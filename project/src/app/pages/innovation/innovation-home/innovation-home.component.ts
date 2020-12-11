import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TAB_CONFIG } from '../innovation-tab-config';
import { NuxeoPagination, DocumentModel, GlobalSearchParams, SearchFilterModel, NuxeoSearchConstants } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService, GlobalDocumentViewComponent, GlobalDocumentDialogService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'innovation-home',
  styleUrls: ['./innovation-home.component.scss'],
  templateUrl: './innovation-home.component.html',
})
export class InnovationHomeComponent extends GlobalDocumentViewComponent {

  tabs: any[] = TAB_CONFIG;

  loading: boolean = false;

  headline: string = 'Driving progress and change across our collective';

  extraHeadline: string;

  subHead: string = 'Material to help inspire and accelerate innovation';

  assetUrlMapping: object = {
    'App-Innovation-Folder': this.documentMapFunc,
    'App-Innovation-Asset': this.documentMapFunc,
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
    ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_SEARCH_TYPE,
  };

  private folderParams: any = {
    pageSize: 12,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
    ecm_path: NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_FOLDER_TYPE,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search for anything...',
    enableQueryParams: false,
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  goToLink(doc: DocumentModel): void {
    this.documentPageService.goToExternalLink(doc);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_MODULE_TYPE,
    };
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    this.performFolders(doc);
  }

  private search(params: {}): Observable<DocumentModel[]> {
    return this.documentPageService.advanceRequest(new GlobalSearchParams(params)).pipe(
      map((res: NuxeoPagination) => res.entries),
    );
  }

  private performFolders(doc: DocumentModel): void {
    const list = [];
    this.loading = true;
    this.folderParams['ecm_parentId'] = doc.uid;
    this.search(this.folderParams).subscribe((docs: DocumentModel[]) => {
      for (const tab of this.tabs) {
        docs.forEach((d: DocumentModel, index: number) => {
          if (tab.title === d.title) {
            list.push(docs[index]);
            docs.splice(index, 1);
          }
        });
      }
      docs.sort((a: DocumentModel, b: DocumentModel) => {
        const nameA = a.title.toUpperCase();
        const nameB = b.title.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.folders = list.concat(docs);
      this.loading = false;
    });
  }

  documentMapFunc(doc: DocumentModel): string {
    let url: string;
    if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + 'NEXT')) {
      url = '/p/innovation/NEXT/folder';
    } else if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + 'Things to Steal')) {
      url = '/p/innovation/Things to Steal/folder';
    }
    if (doc.type === 'App-Innovation-Asset') {
      url = url + '/:parentRef/asset';
    }
    return url;
  }
}
