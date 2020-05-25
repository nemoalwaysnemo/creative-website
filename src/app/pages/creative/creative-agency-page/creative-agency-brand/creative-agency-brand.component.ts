import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DocumentModel, AdvanceSearch, SearchFilterModel, NuxeoPageProviderParams } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService, GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-agency-brand',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-agency-brand.component.html',
})
export class CreativeAgencyBrandComponent extends AbstractDocumentViewComponent implements OnInit {

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'creative_agency_brand full-width';

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', visibleFn: (searchParams: NuxeoPageProviderParams): boolean => searchParams.hasFilter('the_loupe_main_brand_agg') }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected setCurrentDocument(doc?: DocumentModel): void {
    this.document = doc;
    if (doc) {
      this.baseParams$.next(this.buildAssetsParams(doc));
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    const params = {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_AGENCY_FOLDER_TYPE,
    };
    return new NuxeoPageProviderParams(params);
  }

  protected buildAssetsParams(doc?: DocumentModel): NuxeoPageProviderParams {
    const params = {
      pageSize: 20,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_BRAND_FOLDER_TYPE,
      ecm_fulltext: '',
      currentPageIndex: 0,
      app_global_networkshare: true,
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    return new NuxeoPageProviderParams(params);
  }
}
