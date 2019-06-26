import { Component, OnInit } from '@angular/core';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { AdvanceSearch, DocumentModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-my-agency-asset-search',
  templateUrl: './creative-my-agency-asset-search.component.html',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
})
export class CreativeMyAgencyAssetSearchComponent extends AbstractDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  filters: any = {
    // 'the_loupe_main_assettype_agg': { placeholder: 'Asset Type' },
    // 'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    // 'the_loupe_main_country_agg': { placeholder: 'County' },
    // 'the_loupe_main_brand_agg': { placeholder: 'Brand' },
    // 'the_loupe_main_clientName_agg': { placeholder: 'Client' },
    // 'app_edges_industry_agg': { placeholder: 'Industry' },
    // 'app_edges_backslash_category_agg': { placeholder: 'Category' },
    // 'app_edges_tags_edges_agg': { placeholder: 'Edges' },
  };

  showInput: boolean = false;

  multiView: boolean = false;

  showResultSet: boolean = true;

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
