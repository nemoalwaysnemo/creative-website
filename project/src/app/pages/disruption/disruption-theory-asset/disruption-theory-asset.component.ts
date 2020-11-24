import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { TAB_CONFIG } from '../disruption-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-theory-asset',
  styleUrls: ['./disruption-theory-asset.component.scss'],
  templateUrl: './disruption-theory-asset.component.html',
})
export class DisruptionTheoryAssetComponent extends GlobalDocumentViewComponent implements OnInit {

  tabConfig: any = TAB_CONFIG;

  folder: DocumentModel;

  folderLoading: boolean = true;

  showButton: boolean = false;

  enableThumbnailCreation: boolean = true;

  assetUrl: string = '/p/disruption/Disruption How Tos/folder/';

  deleteRedirectUrl: string;

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_THEORY_FOLDER_TYPE,
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

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    this.deleteRedirectUrl = this.assetUrl;
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_THEORY_TYPE,
    };
  }

  private searchFolder(): void {
    const folderId = this.activatedRoute.snapshot.paramMap.get('folder');
    if (folderId) {
      this.getDocumentModel(folderId, this.folderParams).subscribe((res: NuxeoPagination) => {
        this.folderLoading = false;
        this.folder = res.entries.shift();
        if (this.folder) {
          this.deleteRedirectUrl += this.folder.uid;
        }
      });
    } else {
      this.folderLoading = false;
    }
  }

}
