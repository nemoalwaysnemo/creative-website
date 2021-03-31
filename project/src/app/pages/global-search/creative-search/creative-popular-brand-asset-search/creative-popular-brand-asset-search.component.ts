import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, GlobalSearchParams } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-popular-brand-asset-search',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-popular-brand-asset-search.component.html',
})
export class CreativePopularBrandAssetSearchComponent extends GlobalDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'my_brand full-width';

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', visibleFn: (searchParams: GlobalSearchParams): boolean => searchParams.hasParam('the_loupe_main_agency_agg') || searchParams.hasParam('the_loupe_main_campaign_agg') }),
    new SearchFilterModel({ key: 'the_loupe_prodCredits_production_date_agg', placeholder: 'Year', filterValueFn: (bucket: any) => bucket.docCount > 0 }),
    new SearchFilterModel({ key: 'app_global_networkshare_agg', placeholder: 'Showcase', optionLabels: { true: 'Yes', false: 'No' } }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc)); });
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_SELECTED_BRAND_TYPE,
    };
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
      currentPageIndex: 0,
    };
    if (doc) {
      params['the_loupe_main_brand_any'] = `["${doc.get('The_Loupe_Main:brand').join('", "')}"]`;
      params['ecm_uuid_not_eq'] = doc.uid;
    }
    return params;
  }

}
