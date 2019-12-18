import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DocumentModel, AdvanceSearch, SearchFilterModel, AggregateModel } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_META_INFO, NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'creative-popular-brand-asset-search',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-popular-brand-asset-search.component.html',
})
export class CreativePopularBrandAssetSearchComponent extends AbstractDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'my_brand full-width';

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', convertTitle: true }),
    new SearchFilterModel({ key: 'the_loupe_prodCredits_production_date_agg', placeholder: 'Year', filterValue: (bucket: any) => bucket.docCount > 0 }),
    new SearchFilterModel({ key: 'app_global_networkshare_agg', placeholder: 'Showcase', optionLabels: { 'true': 'Yes', 'false': 'No' } }),
  ];

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
      ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
      currentPageIndex: 0,
      pageSize: 20,
    };
    if (doc) {
      params['the_loupe_main_brand_any'] = `["${doc.get('The_Loupe_Main:brand').join('", "')}"]`;
      params['ecm_uuid_not_eq'] = doc.uid;
    }
    return params;
  }

}
