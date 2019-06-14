import { Component } from '@angular/core';
import { AdvanceSearch, DocumentModel, NuxeoPagination } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'disruption-asset',
  styleUrls: ['./disruption-asset.component.scss'],
  templateUrl: './disruption-asset.component.html',
})
export class DisruptionAssetComponent extends AbstractDocumentViewComponent {

  private disruptionDayAsset: string = 'App-Disruption-Day-Asset';

  folder: DocumentModel;

  folderLoading: boolean = true;

  disruptionDayParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    quickFilters: 'ShowInNavigation',
    ecm_path: NUXEO_PATH_INFO.KNOWEDGE_BASIC_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (this.isDisruptionDayAsset(doc)) {
      this.searchFolder(doc.parentRef);
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      quickFilters: '',
      ecm_path: NUXEO_PATH_INFO.KNOWEDGE_BASIC_PATH,
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ASSET_TYPE,
    };
  }

  private searchFolder(folderId: string): void {
    this.getDocumentModel(folderId, this.disruptionDayParams).subscribe((res: NuxeoPagination) => {
      this.folderLoading = false;
      this.folder = res.entries.shift();
    });
  }

  isDisruptionDayAsset(doc: DocumentModel): boolean {
    return doc && doc.type === this.disruptionDayAsset;
  }

}
