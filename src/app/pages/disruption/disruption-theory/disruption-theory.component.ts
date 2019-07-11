import { Component, OnInit } from '@angular/core';
import { Subject, timer, Observable, of as observableOf } from 'rxjs';
import { AdvanceSearch, DocumentModel, NuxeoQuickFilters, SearchResponse, NuxeoPageProviderParams, NuxeoRequestOptions, NuxeoEnricher, NuxeoPagination } from '@core/api';
import { SearchQueryParamsService, AbstractDocumentViewComponent } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../disruption-tab-config';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

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

  beforeSearch: Function = (queryParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions): { queryParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => {
    if (queryParams.hasKeyword()) {
      queryParams = this.buildSearchAssetsParams(queryParams);
      opts.setEnrichers('document', [NuxeoEnricher.document.BREADCRUMB, NuxeoEnricher.document.HIGHLIGHT]);
    }
    return { queryParams, opts };
  }

  afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => {
    if (res.queryParams.hasKeyword() && res.action === 'afterSearch') {
      return this.performSearchAssetsResults(res.response).pipe(
        map((response: NuxeoPagination) => { res.response = response; return res; }),
      );
    }
    return observableOf(res);
  }

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  ngOnInit() {
    this.searchCurrentDocument();
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildDefaultAssetsParams(doc)); });
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
  // get the default sub folders (second-level folders)
  protected buildDefaultAssetsParams(doc?: DocumentModel): NuxeoPageProviderParams {
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
    return new NuxeoPageProviderParams(params);
  }
  // get all matched assets and then get their parent folders
  protected buildSearchAssetsParams(queryParams: NuxeoPageProviderParams): NuxeoPageProviderParams {
    const params = {
      pageSize: 1000,
      currentPageIndex: 0,
      ecm_fulltext: queryParams.ecm_fulltext,
      ecm_mixinType_not_in: '["Folderish"]',
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THEORY_TYPE,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
    };
    return new NuxeoPageProviderParams(params);
  }
  // calculate their parent folder ids
  protected performSearchAssetsResults(res: NuxeoPagination): Observable<NuxeoPagination> {
    if (res.entries.length > 0) {
      const ids = res.entries.map((doc: DocumentModel) => {
        return doc.breadcrumb[doc.breadcrumb.length - 2];
      }).map((doc: DocumentModel) => doc.uid).filter((value, index, self) => { // uniq
        return self.indexOf(value) === index;
      });
      const params = {
        pageSize: 100,
        currentPageIndex: 0,
        ecm_uuid: `["${ids.join('", "')}"]`,
        ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THEORY_FOLDER_TYPE,
        ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      };
      return this.advanceSearch.request(new NuxeoPageProviderParams(params));
    } else {
      return observableOf(res);
    }
  }
}
