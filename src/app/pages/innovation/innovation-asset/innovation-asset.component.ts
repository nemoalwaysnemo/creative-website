import { Component, OnInit } from '@angular/core';
import { AdvanceSearchService, DocumentModel, NuxeoPagination } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { GlobalDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';
import { TAB_CONFIG } from '../innovation-tab-config';
import { parseTabRoute } from '@core/services/helpers';
@Component({
  selector: 'innovation-asset',
  styleUrls: ['./innovation-asset.component.scss'],
  templateUrl: './innovation-asset.component.html',
})
export class InnovationAssetComponent extends GlobalDocumentViewComponent implements OnInit {

  folder: DocumentModel;

  folderLoading: boolean = true;

  showButton: boolean = false;

  deleteRedirectUrl: string = '';

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.INNOVATION_FOLDER_TYPE,
    ecm_mixinType_not_in: '',
  };

  assetUrlMapping: object = {
    'App-Innovation-Folder': this.documentMap,
    'App-Innovation-Asset': this.documentMap,
    '*': '/p/innovation/asset',
  };

  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearchService, activatedRoute, queryParamsService);
  }

  ngOnInit(): void {
    this.onInit();
    this.searchFolder();
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_mixinType_not_in: '',
      ecm_path: NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.INNOVATION_ASSET_TYPE,
    };
  }

  private searchFolder(): void {
    const folderId = this.activatedRoute.snapshot.paramMap.get('folder');
    if (folderId) {
      this.getDocumentModel(folderId, this.folderParams).subscribe((res: NuxeoPagination) => {
        this.folderLoading = false;
        this.folder = res.entries.shift();
        this.deleteRedirectUrl = this.getDeleteRedirectUrl(this.folder);
      });
    } else {
      this.folderLoading = false;
    }
  }

  private getDeleteRedirectUrl(doc: DocumentModel): string {
    return (['App-BizDev-ThoughtLeadership-Folder', 'App-BizDev-Case-Studies-Folder'].includes(doc.type))
            ? this.assetUrlMapping[doc.type] : this.assetUrlMapping[doc.type] + '/' + doc.uid;
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
