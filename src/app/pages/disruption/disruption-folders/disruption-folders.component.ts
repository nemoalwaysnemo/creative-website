import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DocumentModel, AdvanceSearch } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService, PreviewDialogService } from '@pages/shared';
import { TAB_CONFIG } from '../tab-config';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'disruption-folders',
  styleUrls: ['./disruption-folders.component.scss'],
  templateUrl: './disruption-folders.component.html',
})
export class DisruptionFoldersComponent extends AbstractDocumentViewComponent {

  tabs = TAB_CONFIG;

  baseParams$: Subject<any> = new Subject<any>();

  filters: any = {
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    protected previewDialogService: PreviewDialogService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    setTimeout(() => { this.baseParams$.next(this.buildAssetsParams(doc)); }, 0);
  }

  protected getDefaultDocumentParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
      quickFilters: 'ShowInNavigation',
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
    };
  }

  protected buildAssetsParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAY_ASSET_TYPES,
      ecm_path: NUXEO_META_INFO.KNOWEDGE_BASIC_PATH,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.document);
  }

  onCreated(doc: DocumentModel): void {
    this.queryParamsService.changeQueryParams({ refresh: true }, { type: 'refresh' }, 'merge');
  }

}
