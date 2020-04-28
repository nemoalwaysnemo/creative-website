import { Component, OnInit} from '@angular/core';
import { AdvanceSearch, DocumentModel, NuxeoPagination, NuxeoPageProviderConstants } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';
import { TAB_CONFIG } from '../business-development-tab-config';
@Component({
  selector: 'biz-dev-asset',
  styleUrls: ['./biz-dev-asset.component.scss'],
  templateUrl: './biz-dev-asset.component.html',
})
export class BizDevAssetComponent extends AbstractDocumentViewComponent implements OnInit {

  folder: DocumentModel;

  folderLoading: boolean = true;

  tabs: any[] = TAB_CONFIG;

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_ALL_FOLDER_TYPES,
    // ecm_mixinType_not_in: '', // override
    // ecm_mixinType: NuxeoPageProviderConstants.HiddenInNavigation,
  };

  assetUrlMapping: object = {
    'App-BizDev-CaseStudy-Folder': '/p/business-development/Case Studies/folder',
    'App-BizDev-Thought-Folder': '/p/business-development/Thought Leadership/folder',
    'App-BizDev-ThoughtLeadership-Folder': '/p/business-development/Thought Leadership/',
    'App-BizDev-Case-Studies-Folder': '/p/business-development/Case Studies/',
    '*': '/p/business-development/asset',
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
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
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_ASSET_TYPE,
      // ecm_mixinType: NuxeoPageProviderConstants.HiddenInNavigation,
      ecm_mixinType_not_in: '', // override
    };
  }

  private searchFolder(): void {
    const folderId = this.activatedRoute.snapshot.paramMap.get('folder');
    if (folderId) {
      this.getDocumentModel(folderId, this.folderParams).subscribe((res: NuxeoPagination) => {
        this.folderLoading = false;
        this.folder = res.entries.shift();
      });
    } else {
      this.folderLoading = false;
    }
  }
}
