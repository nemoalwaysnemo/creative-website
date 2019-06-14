import { Component } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { AdvanceSearch, DocumentModel, NuxeoQuickFilters } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'intelligence-folder',
  styleUrls: ['./intelligence-folder.component.scss'],
  templateUrl: './intelligence-folder.component.html',
})
export class IntelligenceFolderComponent extends AbstractDocumentViewComponent {

  documentType: string;

  baseParams$: Subject<any> = new Subject<any>();

  filters: any = {
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      this.documentType = this.getCurrentAssetType(doc);
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc)); });
    }
  }

  protected getCurrentDocumentSearchParams(): object {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.KNOWEDGE_BASIC_PATH,
      ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ALL_FOLDERS,
    };
  }

  protected buildAssetsParams(doc?: DocumentModel): any {
    switch (this.getCurrentAssetType(doc)) {
      case 'Industry':
        return this.buildIndustryParams(doc);
      case 'IndustryAsset':
        return this.buildIndustryAssetsParams(doc);
      case 'Consumer':
        return this.buildConsumerAndMarketingParams(doc);
      case 'Marketing':
        return this.buildConsumerAndMarketingParams(doc);
      default:
        return {};
    }
  }

  protected buildConsumerAndMarketingParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.KNOWEDGE_BASIC_PATH,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['app_edges_intelligence_category'] = `["${this.getCurrentAssetType(doc)}"]`;
    }
    return params;
  }

  protected buildIndustryParams(doc?: DocumentModel): any {
    const params = {
      quickFilters: `${NuxeoQuickFilters.HiddenInNavigation},${NuxeoQuickFilters.Alphabetically}`,
      ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_INDUSTRY_TYPE,
      ecm_path: NUXEO_PATH_INFO.KNOWEDGE_BASIC_PATH,
      currentPageIndex: 0,
      pageSize: 100,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

  protected buildIndustryAssetsParams(doc?: DocumentModel): any {
    const params = {
      quickFilters: `${NuxeoQuickFilters.HiddenInNavigation},${NuxeoQuickFilters.Alphabetically}`,
      ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.KNOWEDGE_BASIC_PATH,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['app_edges_industry_any'] = '["' + doc.get('app_Edges:industry').join('", "') + '"]';
    }
    return params;
  }

  protected getCurrentAssetType(doc: DocumentModel) {
    switch (doc.type) {
      case 'App-Intelligence-Industry-Folder':
        return 'Industry';
      case 'App-Intelligence-Consumer-Folder':
        return 'Consumer';
      case 'App-Intelligence-Marketing-Folder':
        return 'Marketing';
      case 'App-Intelligence-Industry':
        return 'IndustryAsset';
      default:
        return 'Intelligence';
    }
  }

}
