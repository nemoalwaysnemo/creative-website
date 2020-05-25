import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, AdvanceSearch, NuxeoPagination, NuxeoPageProviderConstants } from '@core/api';
import { GlobalDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../disruption-tab-config';

@Component({
  selector: 'disruption-day-asset',
  styleUrls: ['./disruption-day-asset.component.scss'],
  templateUrl: './disruption-day-asset.component.html',
})
export class DisruptionDayAssetComponent extends GlobalDocumentViewComponent implements OnInit {

  folder: DocumentModel;

  folderLoading: boolean = true;

  tabs: any[] = TAB_CONFIG;

  showButton: boolean = false;

  backAssetFlag: boolean = true;

  assetUrl: string = '/p/disruption/Disruption Days/day/';

  deleteRedirectUrl: string;

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_mixinType: NuxeoPageProviderConstants.HiddenInNavigation,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
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
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAY_ASSET_TYPES,
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
