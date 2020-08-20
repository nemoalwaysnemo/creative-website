import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService } from '../../shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../backslash-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-asset-view',
  styleUrls: ['./backslash-asset-view.component.scss'],
  templateUrl: './backslash-asset-view.component.html',
})
export class BackslashAssetViewComponent extends GlobalDocumentViewComponent {

  folder: DocumentModel;

  folderLoading: boolean = true;

  showButton: boolean = false;

  enableThumbnailCreation: boolean = true;

  deleteRedirectUrl: string = '';

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  backslashEdgeFolderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.BACKSLASH_EDGE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_EDGE_ALL_FOLDER_TYPE,
    ecm_mixinType_not_in: '',
  };

  assetUrlMapping: object = {
    'App-Backslash-Edges-Folder': '/p/backslash/edge/',
    'App-Backslash-Resources-Assetfolder': '/p/backslash/edge/folder',
    '*': '/p/backslash/edge/asset',
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
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
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
      case 'App-Backslash-Edge-Page':
        return this.backslashEdgeFolderParams;
      default:
        return {};
    }
  }

  private getDeleteRedirectUrl(doc: DocumentModel): string {
    return (['App-Backslash-Edges-Folder'].includes(doc.type))
      ? this.assetUrlMapping[doc.type] : this.assetUrlMapping[doc.type] + '/' + doc.uid;
  }
}
