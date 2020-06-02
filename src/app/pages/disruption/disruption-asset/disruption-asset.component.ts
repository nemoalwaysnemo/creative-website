import { Component } from '@angular/core';
import { AdvanceSearchService, DocumentModel, NuxeoPagination, NuxeoPageProviderConstants } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'disruption-asset',
  styleUrls: ['./disruption-asset.component.scss'],
  templateUrl: './disruption-asset.component.html',
})
export class DisruptionAssetComponent extends GlobalDocumentViewComponent {

  folder: DocumentModel;

  folderLoading: boolean = true;

  showButton: boolean = false;

  backAssetFlag: boolean = false;

  enableThumbnailCreation: boolean = true;

  deleteRedirectUrl: string;

  assetUrlMapping: object = {
    'App-Disruption-Day': '/p/disruption/Disruption Days/day',
    'App-Disruption-Theory-Folder': '/p/disruption/Disruption How Tos/folder',
    '*': '/p/disruption/asset',
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
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService) {
    super(advanceSearchService, activatedRoute, documentPageService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
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
      this.deleteRedirectUrl = this.assetUrlMapping[this.folder.type] + '/' + this.folder.uid;
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
