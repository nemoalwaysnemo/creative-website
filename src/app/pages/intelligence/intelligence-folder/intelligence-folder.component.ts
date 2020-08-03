import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, GlobalSearchSettings } from '@pages/shared';
import { DocumentModel, GlobalSearchParams, NuxeoRequestOptions, SearchFilterModel } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'intelligence-folder',
  styleUrls: ['./intelligence-folder.component.scss'],
  templateUrl: './intelligence-folder.component.html',
})
export class IntelligenceFolderComponent extends GlobalDocumentViewComponent {

  documentType: string;

  resultView: string = 'folder';

  baseParams$: Subject<any> = new Subject<any>();

  placeholder: string = 'Search in title, description and tags only...';

  filters: SearchFilterModel[] = [];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  beforeSearch: Function = (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions): { searchParams: GlobalSearchParams, opts: NuxeoRequestOptions } => {
    if (searchParams.hasKeyword() && this.documentType === 'Industry') {
      this.resultView = 'asset';
      searchParams = this.buildIndustrySearchAssetParams(searchParams);
    } else {
      if (['Industry'].includes(this.documentType)) {
        this.resultView = 'folder';
      } else {
        this.resultView = 'asset';
      }
    }
    return { searchParams, opts };
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

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      this.documentType = this.getCurrentAssetType(doc);
      this.filters = this.getFilters();
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
        return this.buildIndustryAssetParams(doc, searchTerm, settings);
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

  protected triggerSearch(doc: DocumentModel, searchTerm: string = '', settings?: GlobalSearchSettings) {
    timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc, searchTerm, settings)); });
  }

  protected buildConsumerAndMarketingParams(doc: DocumentModel, searchTerm: string = '', settings?: GlobalSearchSettings): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      currentPageIndex: 0,
      ecm_fulltext: searchTerm,
    };
    if (doc) {
      params['app_edges_intelligence_category'] = `["${this.getCurrentAssetType(doc)}"]`;
    }
    return new GlobalSearchParams(params, settings);
  }

  protected buildIndustryParams(doc: DocumentModel, searchTerm: string = '', settings?: GlobalSearchSettings): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_INDUSTRY_TYPE,
      ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      currentPageIndex: 0,
      pageSize: 100,
      ecm_fulltext: searchTerm,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new GlobalSearchParams(params, settings);
  }

  protected buildIndustryAssetParams(doc: DocumentModel, searchTerm: string = '', settings?: GlobalSearchSettings): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      currentPageIndex: 0,
      ecm_fulltext: searchTerm,
    };
    if (doc) {
      params['app_edges_industry_any'] = '["' + doc.get('app_Edges:industry').join('", "') + '"]';
    }
    return new GlobalSearchParams(params, settings);
  }

  protected buildIndustrySearchAssetParams(searchParams: GlobalSearchParams): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      currentPageIndex: searchParams.getSettings('append') ? searchParams.providerParams.currentPageIndex : 0,
      pageSize: searchParams.getSettings('append') ? searchParams.providerParams.pageSize : GlobalSearchParams.PageSize,
      ecm_fulltext: searchParams.providerParams.ecm_fulltext,
    };
    return new GlobalSearchParams(params);
  }

  private getFilters(): SearchFilterModel[] {
    if (this.documentType === 'Consumer') {
      return [
        new SearchFilterModel({ key: 'ecm_tag_agg', placeholder: 'Tag' }),
        new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
        new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
        new SearchFilterModel({ key: 'app_edges_intelligence_type_agg', placeholder: 'Intelligence Type' }),
        new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
      ];
    } else {
      return [
        new SearchFilterModel({ key: 'ecm_tag_agg', placeholder: 'Tag' }),
        new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
        new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
        new SearchFilterModel({ key: 'app_edges_intelligence_type_agg', placeholder: 'Intelligence Type' }),
        new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
      ];
    }
  }
}
