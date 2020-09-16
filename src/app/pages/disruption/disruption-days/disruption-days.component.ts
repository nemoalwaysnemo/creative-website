import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { TAB_CONFIG } from '../disruption-tab-config';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings } from '@pages/shared';
import { DocumentModel, SearchResponse, GlobalSearchParams, NuxeoRequestOptions, NuxeoEnricher, NuxeoPagination, SearchFilterModel, NuxeoSearchConstants } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-days',
  styleUrls: ['./disruption-days.component.scss'],
  templateUrl: './disruption-days.component.html',
})
export class DisruptionDaysComponent extends GlobalDocumentViewComponent implements OnInit {

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  tabs: any[] = TAB_CONFIG;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  defaultParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_DAYS_TYPE,
  };

  beforeSearch: Function = (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions): { searchParams: GlobalSearchParams, opts: NuxeoRequestOptions } => {
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

  ngOnInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_DAYS_FOLDER_TYPE,
    };
  }

  // get all matched assets and then get their parent folders
  protected buildSearchAssetsParams(searchParams: GlobalSearchParams): GlobalSearchParams {
    const params: any = {
      pageSize: 1000,
      currentPageIndex: 0,
      ecm_fulltext: searchParams.providerParams.ecm_fulltext,
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_DAY_ASSET_TYPES,
    };
    return searchParams.setParams(params);
  }
  // calculate their parent folder ids
  protected performSearchAssetsResults(res: NuxeoPagination): Observable<NuxeoPagination> {
    if (res.entries.length > 0) {
      const ids = res.entries.map((doc: DocumentModel) => doc.parentRef).filter((value, index, self) => { // uniq
        return self.indexOf(value) === index;
      });
      const params: any = {
        currentPageIndex: 0,
        pageSize: ids.length,
        ecm_uuid: `["${ids.join('", "')}"]`,
        ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
        ecm_path: NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
        ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_DAYS_TYPE,
      };
      return this.documentPageService.advanceRequest(new GlobalSearchParams(params));
    } else {
      return observableOf(res);
    }
  }

}
