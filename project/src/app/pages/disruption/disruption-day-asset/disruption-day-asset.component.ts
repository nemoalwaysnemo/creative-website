import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination, NuxeoSearchConstants } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-day-asset',
  styleUrls: ['./disruption-day-asset.component.scss'],
  templateUrl: './disruption-day-asset.component.html',
})
export class DisruptionDayAssetComponent extends GlobalDocumentViewComponent implements OnInit {

  folder: DocumentModel;

  folderLoading: boolean = true;

  showButton: boolean = false;

  backAssetFlag: boolean = true;

  enableThumbnailCreation: boolean = true;

  assetUrl: string = '/p/disruption/Disruption Days/day/';

  deleteRedirectUrl: string;

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_DAYS_TYPE,
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
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_DAY_ASSET_TYPES,
    };
  }

  private searchFolder(): void {
    const folderId = this.activatedRoute.snapshot.paramMap.get('folder');
    if (folderId) {
      this.getDocumentModel(folderId, this.folderParams).subscribe((res: NuxeoPagination) => {
        this.folderLoading = false;
        this.folder = res.entries.shift();
        this.deleteRedirectUrl = this.assetUrl + this.folder.uid;
      });
    } else {
      this.folderLoading = false;
    }
  }

}
