import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { NuxeoPagination, DocumentModel, NuxeoSearchParams, SearchFilterModel, NuxeoPageProviderConstants } from '@core/api';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';
import { TAB_CONFIG } from '../innovation-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'innovation-home',
  styleUrls: ['./innovation-home.component.scss'],
  templateUrl: './innovation-home.component.html',
})
export class InnovationHomeComponent extends BaseDocumentViewComponent {

  tabs: any[] = TAB_CONFIG;

  loading: boolean = true;

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

  private baseFolderParams: any = {
    pageSize: 100,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_mixinType: NuxeoPageProviderConstants.HiddenInNavigation,
    ecm_path: NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_FOLDER_TYPE,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search for anything...',
    enableQueryParams: false,
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
    this.performFolders();
  }

  private performFolders(): void {
    this.documentPageService.advanceRequest(new NuxeoSearchParams(this.baseFolderParams)).pipe(
      map((res: NuxeoPagination) => {
        const docs = [];
        this.tabs.forEach(x => {
          const folder = res.entries.find(doc => doc.title === x.title);
          if (folder) {
            docs.push(folder);
          }
        });
        return docs;
      }),
    ).subscribe((docs: DocumentModel[]) => {
      this.folders = docs;
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
