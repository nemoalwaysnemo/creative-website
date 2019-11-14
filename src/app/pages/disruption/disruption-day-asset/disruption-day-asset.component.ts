import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, AdvanceSearch, NuxeoPagination } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../disruption-tab-config';

@Component({
  selector: 'disruption-day-asset',
  styleUrls: ['./disruption-day-asset.component.scss'],
  templateUrl: './disruption-day-asset.component.html',
})
export class DisruptionDayAssetComponent extends AbstractDocumentViewComponent implements OnInit {

  folder: DocumentModel;

  folderLoading: boolean = true;

  tabs: any[] = TAB_CONFIG;

  showButton: boolean = false;

  backAssetFlag: boolean = true;

  deleteRedirect = '/p/disruption/Disruption Days';

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_mixinType: '["HiddenInNavigation"]',
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
      });
    } else {
      this.folderLoading = false;
    }
  }

}
