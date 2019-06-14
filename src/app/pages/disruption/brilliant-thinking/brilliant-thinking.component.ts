import { Component, OnInit } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { AdvanceSearch, DocumentModel, NuxeoPermission } from '@core/api';
import { PreviewDialogService, AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../disruption-tab-config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'disruption-brilliant-thinking-page',
  styleUrls: ['./brilliant-thinking.component.scss'],
  templateUrl: './brilliant-thinking.component.html',
})
export class BrilliantThinkingComponent extends AbstractDocumentViewComponent implements OnInit {

  tabs = TAB_CONFIG;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  filters: any = {
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
  };

  defaultParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THINKING_TYPE,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_THINKING_PATH,
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    protected previewDialogService: PreviewDialogService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  ngOnInit() {
    this.searchCurrentDocument();
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      this.addChildrenPermission$ = doc.hasPermission(NuxeoPermission.AddChildren);
    }
  }

  protected getCurrentDocumentSearchParams(): object {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_THINKING_PATH,
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THINKING_FOLDER_TYPE,
    };
  }

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.document);
  }

  onCreated(doc: DocumentModel): void {
    this.refresh();
  }
}
