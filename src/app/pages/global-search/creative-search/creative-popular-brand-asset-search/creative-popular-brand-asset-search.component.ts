import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DocumentModel, AdvanceSearch } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-popular-brand-asset-search',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-popular-brand-asset-search.component.html',
})
export class CreativePopularBrandAssetSearchComponent extends AbstractDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'third';

  showInput: boolean = false;

  filters: any = {
    // 'the_loupe_main_brand_agg': { placeholder: 'Brand' },
    // 'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    // 'the_loupe_main_country_agg': { placeholder: 'County', iteration: true },
    // 'the_loupe_main_assettype_agg': { placeholder: 'Asset Type' },
    // 'the_loupe_main_clientName_agg': { placeholder: 'Client' },
    // 'app_edges_industry_agg': { placeholder: 'Industry' },
    // 'app_edges_backslash_category_agg': { placeholder: 'Category' },
    // 'app_edges_tags_edges_agg': { placeholder: 'Edges' },
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    this.baseParams$.next(this.buildAssetsParams(doc));
  }

  protected getCurrentDocumentSearchParams(): any {
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
      params['ecm_uuid_not_eq'] = doc.uid;
    }
    return params;
  }

}
