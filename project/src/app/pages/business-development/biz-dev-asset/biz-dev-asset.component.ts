import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../business-development-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'biz-dev-asset',
  styleUrls: ['./biz-dev-asset.component.scss'],
  templateUrl: './biz-dev-asset.component.html',
})
export class BizDevAssetComponent extends GlobalDocumentViewComponent implements OnInit {

  folder: DocumentModel;

  folderLoading: boolean = true;

  showButton: boolean = false;

  enableThumbnailCreation: boolean = true;

  deleteRedirectUrl: string = '';

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_ALL_FOLDER_TYPES,
    ecm_mixinType_not_in: '',
  };

  assetUrlMapping: object = {
    'App-BizDev-CaseStudy-Folder': '/p/business-development/Case Studies/folder',
    'App-BizDev-Thought-Folder': '/p/business-development/Thought Leadership/folder',
    'App-BizDev-ThoughtLeadership-Folder': '/p/business-development/Thought Leadership/',
    'App-BizDev-Case-Studies-Folder': '/p/business-development/Case Studies/',
    '*': '/p/business-development/asset',
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  ngOnInit(): void {
    this.onInit();
    this.searchFolder();
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_mixinType_not_in: '',
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_ASSET_TYPE,
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
}
