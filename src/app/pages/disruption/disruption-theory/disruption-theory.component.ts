import { Component, OnInit } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { AdvanceSearch, DocumentModel, NuxeoQuickFilters, SearchResponse } from '@core/api';
import { SearchQueryParamsService, AbstractDocumentViewComponent } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../disruption-tab-config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'disruption-theory-page',
  styleUrls: ['./disruption-theory.component.scss'],
  templateUrl: './disruption-theory.component.html',
})
export class DisruptionTheoryComponent extends AbstractDocumentViewComponent implements OnInit {

  baseParams$: Subject<any> = new Subject<any>();

  tabs = TAB_CONFIG;

  filters: any = {
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
  };


  responseHandler: Function = (res: SearchResponse) => {
    if (res.queryParams.ecm_fulltext) {
    }
    return res;
  }

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  ngOnInit() {
    this.searchCurrentDocument();
    // this.onAssetsSearch();
  }

  protected onAssetsSearch(): void {
    const subscription = this.advanceSearch.onSearch().subscribe((res: SearchResponse) => {
      if (res.action === 'beforeSearch') {
        // this.buildSearchAssetsParams(this.document, res);
      } else if (res.queryParams.ecm_fulltext) {

      }
    });
    this.subscription.add(subscription);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc)); });
    }
  }

  protected getCurrentDocumentSearchParams(): object {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THEORY_FOLDER_TYPE,
    };
  }

  protected buildAssetsParams(doc?: DocumentModel): any {
    const params = {
      pageSize: 20,
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THEORY_FOLDER_TYPE,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      quickFilters: `${NuxeoQuickFilters.HiddenInNavigation},${NuxeoQuickFilters.Alphabetically}`,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

  protected buildSearchAssetsParams(doc: DocumentModel, res: SearchResponse): any {
    const params = {
      pageSize: 1000,
      currentPageIndex: 0,
      ecm_fulltext: res.queryParams.ecm_fulltext,
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THEORY_FOLDER_TYPE,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      quickFilters: `${NuxeoQuickFilters.HiddenInNavigation},${NuxeoQuickFilters.Alphabetically}`,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

}
