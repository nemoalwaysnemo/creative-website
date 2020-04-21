import { Component } from '@angular/core';
import { AdvanceSearch, DocumentModel, NuxeoPagination, NuxeoPageProviderConstants } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'biz-dev-asset',
  styleUrls: ['./biz-dev-asset.component.scss'],
  templateUrl: './biz-dev-asset.component.html',
})
export class BizDevAssetComponent extends AbstractDocumentViewComponent {

  folder: DocumentModel;

  folderLoading: boolean = true;

  showButton: boolean = true;

  backAssetFlag: boolean = false;

  assetUrlMapping: object = {
    'App-BizDev-CaseStudy-Folder': '/p/business-development/Case Studies/folder/',
    'App-BizDev-Thought-Folder': '/p/business-development/Thought Leadership/folder/',
    '*': '/p/business-development/asset',
  };

  disruptionDayParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_mixinType: NuxeoPageProviderConstants.HiddenInNavigation,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
  };

  disruptionTheoryParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THEORY_FOLDER_TYPE,
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      this.showButton = doc.type !== 'App-Disruption-Day-Asset';
    }

    if (this.showFolderView(doc)) {
      this.searchFolder(doc);
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_mixinType_not_in: '', // override
      ecm_path: NUXEO_PATH_INFO.KNOWEDGE_BASIC_PATH,
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ASSET_TYPE,
    };
  }

  private searchFolder(doc: DocumentModel): void {
    this.getDocumentModel(doc.parentRef, this.getFolderParams(doc)).subscribe((res: NuxeoPagination) => {
      this.folderLoading = false;
      this.folder = res.entries.shift();
    });
  }

  private getFolderParams(doc: DocumentModel): any {
    switch (doc.type) {
      case 'App-Disruption-Day-Asset':
        this.backAssetFlag = true;
        return this.disruptionDayParams;
      case 'App-Disruption-Theory-Asset':
        return this.disruptionTheoryParams;
      default:
        return {};
    }
  }

  showFolderView(doc: DocumentModel): boolean {
    return doc && ['App-Disruption-Day-Asset', 'App-Disruption-Theory-Asset'].includes(doc.type);
  }
}
