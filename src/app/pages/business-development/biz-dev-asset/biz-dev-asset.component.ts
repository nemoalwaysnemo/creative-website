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
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_TYPE,
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
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_CASE_STUDIES_ASSET_TYPE,
      ecm_mixinType: NuxeoPageProviderConstants.HiddenInNavigation,
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
