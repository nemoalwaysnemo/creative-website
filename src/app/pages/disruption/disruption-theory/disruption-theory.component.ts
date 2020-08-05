import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentModel, SearchResponse, GlobalSearchParams, NuxeoRequestOptions, NuxeoEnricher, NuxeoPagination, SearchFilterModel } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { TAB_CONFIG } from '../disruption-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-theory',
  styleUrls: ['./disruption-theory.component.scss'],
  templateUrl: './disruption-theory.component.html',
})
export class DisruptionTheoryComponent extends GlobalDocumentViewComponent implements OnInit {

  baseParams$: Subject<any> = new Subject<any>();

  tabs: any[] = TAB_CONFIG;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  beforeSearch: Function = (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions): { searchParams: GlobalSearchParams, opts: NuxeoRequestOptions } => {
    if (searchParams.hasKeyword()) {
      searchParams = this.buildSearchAssetsParams(searchParams);
      opts.setEnrichers('document', [NuxeoEnricher.document.BREADCRUMB, NuxeoEnricher.document.HIGHLIGHT]);
    }
    return { searchParams, opts };
  }

  afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => {
    if (res.searchParams.hasKeyword() && res.action === 'afterSearch') {
      return this.performSearchAssetsResults(res.response).pipe(
        map((response: NuxeoPagination) => { res.response = response; return res; }),
      );
    }
    return observableOf(res);
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  ngOnInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildDefaultAssetsParams(doc)); });
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_THEORY_FOLDER_TYPE,
    };
  }
  // get the default sub folders (second-level folders)
  protected buildDefaultAssetsParams(doc: DocumentModel): GlobalSearchParams {
    const params: any = {
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_THEORY_FOLDER_TYPE,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new GlobalSearchParams(params);
  }
  // get all matched assets and then get their parent folders
  protected buildSearchAssetsParams(searchParams: GlobalSearchParams): GlobalSearchParams {
    const params: any = {
      pageSize: 1000,
      currentPageIndex: 0,
      ecm_fulltext: searchParams.providerParams.ecm_fulltext,
      ecm_mixinType_not_in: '["Folderish"]',
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_THEORY_TYPE,
    };
    return searchParams.setParams(params);
  }
  // calculate their parent folder ids
  protected performSearchAssetsResults(res: NuxeoPagination): Observable<NuxeoPagination> {
    if (res.entries.length > 0) {
      const ids = res.entries.map((doc: DocumentModel) => {
        return doc.breadcrumb[doc.breadcrumb.length - 2];
      }).filter((doc: DocumentModel) => `${doc.path}/` !== NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH).map((doc: DocumentModel) => doc.uid).filter((value, index, self) => { // uniq
        return self.indexOf(value) === index;
      });
      const params: any = {
        currentPageIndex: 0,
        pageSize: ids.length,
        ecm_uuid: `["${ids.join('", "')}"]`,
        ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
        ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_THEORY_FOLDER_TYPE,
      };
      return this.documentPageService.advanceRequest(new GlobalSearchParams(params));
    } else {
      return observableOf(res);
    }
  }
}
