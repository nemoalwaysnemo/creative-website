import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService } from '../../shared';
import { TAB_CONFIG } from '../backslash-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-asset-view',
  styleUrls: ['./backslash-asset-view.component.scss'],
  templateUrl: './backslash-asset-view.component.html',
})
export class BackslashAssetViewComponent extends GlobalDocumentViewComponent {

  tabConfig: any = TAB_CONFIG;

  folder: DocumentModel;

  folderLoading: boolean = true;

  showButton: boolean = false;

  enableThumbnailCreation: boolean = true;

  deleteRedirectUrl: string = '';

  viewerSettings: any = {
  };

  backslashEdgeFolderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: this.documentPageService.getConfig('path:BACKSLASH_EDGE_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_EDGE_ALL_FOLDER_TYPE,
    ecm_mixinType_not_in: '',
  };

  backslashResourceFolderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: this.documentPageService.getConfig('path:BACKSLASH_RESOURCES_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_RESOURCES_ALL_FOLDER_TYPE,
    ecm_mixinType_not_in: '',
  };

  backslashCaseStudyFolderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: this.documentPageService.getConfig('path:BACKSLASH_CASE_STUDIES_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_CASE_STUDIES_ALL_FOLDER_TYPE,
    ecm_mixinType_not_in: '',
  };

  assetUrlMapping: any = {
    'App-Backslash-Edges-Folder': '/p/backslash/edge/',
    'App-Backslash-Edges-Assetfolder': '/p/backslash/edge/folder',
    'App-Backslash-Resources-Folder': '/p/backslash/resource/',
    'App-Backslash-Resources-Assetfolder': '/p/backslash/resource/folder',
    'App-Backslash-Case-Studies-Folder': '/p/backslash/report/',
    'App-Backslash-Case-Study-Folder': '/p/backslash/report/folder',
    '*': '/p/backslash/assetview',
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    this.searchFolder(doc);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_mixinType_not_in: '',
      ecm_path: this.documentPageService.getConfig('path:BACKSLASH_BASE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ASSET_TYPE,
    };
  }

  private searchFolder(doc: DocumentModel): void {
    this.getDocumentModel(doc.parentRef, this.getFolderParams(doc)).subscribe((res: NuxeoPagination) => {
      this.folderLoading = false;
      this.folder = res.entries.shift();
      this.deleteRedirectUrl = this.getDeleteRedirectUrl(this.folder);
    });
  }

  private getFolderParams(doc: DocumentModel): any {
    switch (doc.type) {
      case 'App-Backslash-Edges-Asset':
        return this.backslashEdgeFolderParams;
      case 'App-Backslash-Resources-Asset':
        return this.backslashResourceFolderParams;
      case 'App-Backslash-Case-Study':
        return this.backslashCaseStudyFolderParams;
      default:
        return {};
    }
  }

  private getDeleteRedirectUrl(doc: DocumentModel): string {
    return (['App-Backslash-Edges-Folder', 'App-Backslash-Resources-Folder', 'App-Backslash-Case-Study-Folder', 'App-Backslash-Case-Studies-Folder'].includes(doc.type))
      ? this.assetUrlMapping[doc.type] : this.assetUrlMapping[doc.type] + '/' + doc.uid;
  }

  showFolderInfo(doc: DocumentModel): boolean {
    if (doc) {
      switch (doc.type) {
        case 'App-Backslash-Edges-Asset':
          return false;
        case 'App-Backslash-Resources-Asset':
          return false;
        case 'App-Backslash-Case-Study':
          return false;
        default:
          return true;
      }
    }
  }
}
