import { Component } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentPageService, GlobalSearchFormSettings } from '@pages/shared';
import { SearchResponse, NuxeoPagination, SearchFilterModel, GlobalSearchParams } from '@core/api';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-document-asset-search',
  styleUrls: ['./creative-document-asset-search.component.scss'],
  templateUrl: './creative-document-asset-search.component.html',
})
export class CreativeDocumentAssetSearchComponent extends BaseDocumentViewComponent {

  resultHeader: string = '';

  layout: string = 'creative_asset_search';

  currentView: string = 'thumbnailView';

  defaultParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', visibleFn: (searchParams: GlobalSearchParams): boolean => searchParams.hasParam('the_loupe_main_brand_agg') || searchParams.hasParam('the_loupe_main_campaign_agg') }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  afterSearch: (res: SearchResponse) => Observable<SearchResponse> = (res: SearchResponse) => {
    if (res.action === 'afterSearch') {
      return this.documentPageService.advanceRequestTitleByUIDs(res.response, ['The_Loupe_Main:campaign']).pipe(
        map((response: NuxeoPagination) => { res.response = response; return res; }),
      );
    }
    return observableOf(res);
  }

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
    this.setResultHeader();
  }

  onResultViewChanged(name: string): void {
    this.currentView = name;
  }

  private setResultHeader(): void {
    const subscription = this.documentPageService.onQueryParamsChanged().subscribe((params: Params) => {
      if (params.hasOwnProperty('app_global_networkshare')) {
        this.resultHeader = 'Global Showcase';
      } else {
        this.resultHeader = '';
      }
    });
    this.subscription.add(subscription);
  }

}
