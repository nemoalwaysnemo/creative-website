import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer, Observable, of as observableOf } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, GlobalSearchSettings } from '@pages/shared';
import { DocumentModel, NuxeoPageProviderParams, NuxeoRequestOptions, NuxeoEnricher, SearchResponse, NuxeoPagination, SearchFilterModel } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'intelligence-folder',
  styleUrls: ['./intelligence-folder.component.scss'],
  templateUrl: './intelligence-folder.component.html',
})
export class IntelligenceFolderComponent extends GlobalDocumentViewComponent {

  documentType: string;

  baseParams$: Subject<any> = new Subject<any>();

  placeholder: string = 'Search in title, description and tags only...';

  filters: SearchFilterModel[] = [];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  beforeSearch: Function = (searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions): { searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => {
    if (searchParams.hasKeyword() && this.documentType === 'Industry') {
      searchParams = this.buildIndustryParams(this.document, searchParams.ecm_fulltext);
      opts.setEnrichers('document', [NuxeoEnricher.document.HIGHLIGHT]);
    }
    return { searchParams, opts };
  }

  afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => {
    if (res.searchParams.hasKeyword() && res.action === 'afterSearch' && this.documentType === 'Industry') {
      return this.performSearchAssetsResults(res).pipe(
        concatMap((response: NuxeoPagination) => this.performSearchIndustryResults(response)),
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

  onKeyup(event: any): void {
    if (this.document) {
      this.triggerSearch(this.document, event.target.value.trim(), new GlobalSearchSettings({
        fulltextKey: 'intelligence_fulltext',
        syncFormValue: false,
        showFilter: true,
      }));
    }
  }

  protected triggerSearch(doc: DocumentModel, searchTerm: string = '', settings?: GlobalSearchSettings) {
    timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc, searchTerm, settings)); });
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      this.documentType = this.getCurrentAssetType(doc);
      this.setFilters();
      this.triggerSearch(doc);
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ALL_FOLDERS,
    };
  }

  protected getCurrentAssetType(doc: DocumentModel) {
    switch (doc.type) {
      case 'App-Intelligence-Industry-Folder':
        return 'Industry';
      case 'App-Intelligence-Consumer-Folder':
        return 'Consumer';
      case 'App-Intelligence-Marketing-Folder':
        return 'Marketing';
      case 'App-Intelligence-Brands-Folder':
        return 'Brands';
      case 'App-Intelligence-Industry':
        return 'IndustryAsset';
      default:
        return 'Intelligence';
    }
  }

  protected buildAssetsParams(doc: DocumentModel, searchTerm: string = '', settings?: GlobalSearchSettings): any {
    switch (this.getCurrentAssetType(doc)) {
      case 'Industry':
        return this.buildIndustryParams(doc, searchTerm, settings);
      case 'IndustryAsset':
        return this.buildIndustryAssetsParams(doc, searchTerm, settings);
      case 'Consumer':
        return this.buildConsumerAndMarketingParams(doc, searchTerm, settings);
      case 'Marketing':
        return this.buildConsumerAndMarketingParams(doc, searchTerm, settings);
      case 'Brands':
        return this.buildConsumerAndMarketingParams(doc, searchTerm, settings);
      default:
        return {};
    }
  }

  protected buildConsumerAndMarketingParams(doc: DocumentModel, searchTerm: string = '', settings?: GlobalSearchSettings): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: searchTerm,
    };
    if (doc) {
      params['app_edges_intelligence_category'] = `["${this.getCurrentAssetType(doc)}"]`;
    }
    return new NuxeoPageProviderParams(params).setSettings(settings);
  }

  protected buildIndustryParams(doc: DocumentModel, searchTerm: string = '', settings?: GlobalSearchSettings): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_INDUSTRY_TYPE,
      ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      currentPageIndex: 0,
      pageSize: 100,
      ecm_fulltext: searchTerm,
    };
    if (searchTerm) {
      params['keyword'] = searchTerm;
    }
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new NuxeoPageProviderParams(params).setSettings(settings);
  }

  protected buildIndustryAssetsParams(doc: DocumentModel, searchTerm: string = '', settings?: GlobalSearchSettings): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: searchTerm,
    };
    if (doc) {
      params['app_edges_industry_any'] = '["' + doc.get('app_Edges:industry').join('", "') + '"]';
    }
    return new NuxeoPageProviderParams(params).setSettings(settings);
  }

  protected performSearchAssetsResults(res: SearchResponse): Observable<NuxeoPagination> {
    if (res.response.entries.length > 0) {
      const industries: string[] = this.getDocumentIndustries(res.response);
      if (industries.length > 0) {
        const params = {
          ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE,
          ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
          app_edges_industry_any: '["' + industries.join('", "') + '"]',
          ecm_fulltext: res.searchParams.keyword,
          currentPageIndex: 0,
          pageSize: 1000,
        };
        return this.documentPageService.advanceRequest(new NuxeoPageProviderParams(params));
      }
    }
    return observableOf(res.response);
  }

  // calculate their parent folder ids
  protected performSearchIndustryResults(res: NuxeoPagination): Observable<NuxeoPagination> {
    if (res.entries.length > 0) {
      const industries: string[] = this.getDocumentIndustries(res);
      if (industries.length > 0) {
        const params = {
          pageSize: 100,
          currentPageIndex: 0,
          app_edges_industry: `["${industries.join('", "')}"]`,
          ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
          ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_INDUSTRY_TYPE,
        };
        return this.documentPageService.advanceRequest(new NuxeoPageProviderParams(params));
      }
    }
    return observableOf(res);
  }

  private getDocumentIndustries(res: NuxeoPagination): string[] {
    let industries: string[] = [];
    res.entries.forEach((doc: DocumentModel) => {
      if (doc.get('app_Edges:industry').length > 0) {
        industries = industries.concat(doc.get('app_Edges:industry'));
      }
    });
    return industries;
  }

  private setFilters(): void {
    if (this.documentType === 'Consumer') {
      this.filters = [
        new SearchFilterModel({ key: 'ecm_tag_agg', placeholder: 'Tag' }),
        new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
        new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
        new SearchFilterModel({ key: 'app_edges_intelligence_type_agg', placeholder: 'Intelligence Type' }),
        new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
      ];
    } else {
      this.filters = [
        new SearchFilterModel({ key: 'ecm_tag_agg', placeholder: 'Tag' }),
        new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
        new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
        new SearchFilterModel({ key: 'app_edges_intelligence_type_agg', placeholder: 'Intelligence Type' }),
        new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
      ];
    }
  }

}
