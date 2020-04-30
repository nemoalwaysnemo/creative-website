import { Component, OnInit } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { AdvanceSearch, DocumentModel, NuxeoPermission, SearchResponse, NuxeoPageProviderParams, NuxeoRequestOptions, NuxeoEnricher, NuxeoPagination, SearchFilterModel, NuxeoPageProviderConstants } from '@core/api';
import { GlobalDocumentDialogService, AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../disruption-tab-config';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'disruption-page',
  styleUrls: ['./disruption-days.component.scss'],
  templateUrl: './disruption-days.component.html',
})
export class DisruptionDaysComponent extends AbstractDocumentViewComponent implements OnInit {

  tabs: any[] = TAB_CONFIG;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

  beforeSearch: Function = (searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions): { searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => {
    if (searchParams.hasKeyword()) {
      searchParams = this.buildSearchAssetsParams(searchParams);
      opts.setEnrichers('document', [NuxeoEnricher.document.HIGHLIGHT]);
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

  defaultParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_mixinType: NuxeoPageProviderConstants.HiddenInNavigation,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    protected globalDocumentDialogService: GlobalDocumentDialogService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  ngOnInit() {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      this.addChildrenPermission$ = doc.hasPermission(NuxeoPermission.AddChildren);
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_FOLDER_TYPE,
    };
  }

  // get all matched assets and then get their parent folders
  protected buildSearchAssetsParams(queryParams: NuxeoPageProviderParams): NuxeoPageProviderParams {
    const params = {
      pageSize: 1000,
      currentPageIndex: 0,
      ecm_fulltext: queryParams.ecm_fulltext,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
      ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAY_ASSET_TYPES,
    };
    return new NuxeoPageProviderParams(params);
  }
  // calculate their parent folder ids
  protected performSearchAssetsResults(res: NuxeoPagination): Observable<NuxeoPagination> {
    if (res.entries.length > 0) {
      const ids = res.entries.map((doc: DocumentModel) => doc.parentRef).filter((value, index, self) => { // uniq
        return self.indexOf(value) === index;
      });
      const params = {
        currentPageIndex: 0,
        pageSize: ids.length,
        ecm_uuid: `["${ids.join('", "')}"]`,
        ecm_mixinType: NuxeoPageProviderConstants.HiddenInNavigation,
        ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
        ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
      };
      return this.advanceSearch.request(new NuxeoPageProviderParams(params));
    } else {
      return observableOf(res);
    }
  }

  openDialog(dialog: any): void {
    this.globalDocumentDialogService.open(dialog);
  }

}
