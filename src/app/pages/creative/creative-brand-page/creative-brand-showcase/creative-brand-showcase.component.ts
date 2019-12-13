import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DocumentModel, AdvanceSearch, SearchFilterModel } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-brand-showcase',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-brand-showcase.component.html',
})
export class CreativeBrandShowcaseComponent extends AbstractDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'creative_brand_showcase full-width';

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', convertTitle: true }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'the_loupe_prodCredits_production_date_agg', placeholder: 'Year', filterValue: (bucket: any) => bucket.docCount > 0 }),
    new SearchFilterModel({ key: 'app_global_networkshare_agg', placeholder: 'Showcase', optionLabels: { 'true': 'Yes', 'false': 'No' } }),
  ];

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected setCurrentDocument(doc?: DocumentModel): void {
    this.document = doc;
    this.baseParams$.next(this.buildAssetsParams(doc));
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPES,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_BRAND_FOLDER_TYPE,
    };
  }

  protected buildAssetsParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    return params;
  }
}
