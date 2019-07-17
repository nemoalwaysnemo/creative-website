
import { Component, OnInit } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentModel, AdvanceSearch, NuxeoPermission, NuxeoQuickFilters } from '@core/api';
import { PreviewDialogService, SearchQueryParamsService, AbstractDocumentViewComponent } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../favorite-tab-config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'favorite-brand',
  templateUrl: './favorite-brand.component.html',
  styleUrls: ['./favorite-brand.component.scss'],
})
export class FavoriteBrandComponent extends AbstractDocumentViewComponent implements OnInit {

  defaultParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ROADMAP_TYPE,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_ROADMAPS_PATH,
  };

  tabs = TAB_CONFIG;

  parentDocument: DocumentModel;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  filters: any = {
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'app_edges_industry_agg': { placeholder: 'Industry', iteration: true },
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    protected previewDialogService: PreviewDialogService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  ngOnInit() {
    this.searchCurrentDocument().subscribe();
  }

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.parentDocument);
  }

  onCreated(doc: DocumentModel): void {
    this.queryParamsService.changeQueryParams({ refresh: true }, { type: 'refresh' }, 'merge');
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
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_ROADMAPS_PATH,
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ROADMAP_FOLDER_TYPE,
    };
  }

}
