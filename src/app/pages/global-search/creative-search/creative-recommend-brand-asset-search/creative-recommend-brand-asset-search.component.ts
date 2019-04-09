import { Component } from '@angular/core';
import { DocumentModel, AdvanceSearch } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'tbwa-creative-recommend-brand-asset-search',
  styleUrls: ['./creative-recommend-brand-asset-search.component.scss'],
  templateUrl: './creative-recommend-brand-asset-search.component.html',
})
export class CreativeRecommendedBrandAssetSearchComponent extends AbstractDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  filters: any = {
    'the_loupe_main_assettype_agg': { placeholder: 'Asset Type' },
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'the_loupe_main_country_agg': { placeholder: 'County' },
    'the_loupe_main_brand_agg': { placeholder: 'Brand' },
    'the_loupe_main_clientName_agg': { placeholder: 'Client' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
    'the_loupe_main_campaign_agg': { placeholder: 'Campaign' },
    'app_edges_backslash_category_agg': { placeholder: 'Category' },
    'app_edges_tags_edges_agg': { placeholder: 'Edges' },
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, queryParamsService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    this.baseParams$.next(this.buildAssetsParams(doc));
  }

  protected getDefaultDocumentParams(): any {
    return {
      pageSize: 1,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_SELECTED_BRAND_TYPE,
    };
  }

  protected buildAssetsParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_path: '',
    };
    if (doc) {
      params['the_loupe_main_brand_any'] = `["${doc.get('The_Loupe_Main:brand').join('", "')}"]`;
      params['ecm_uuid_exclude'] = doc.uid;
    }
    return params;
  }

}
