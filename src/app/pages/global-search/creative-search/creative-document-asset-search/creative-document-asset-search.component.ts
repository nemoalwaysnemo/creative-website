import { Component, OnInit, OnDestroy } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { SearchQueryParamsService } from '@pages/shared';
import { AdvanceSearch, SearchResponse, NuxeoPagination } from '@core/api';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Params } from '@angular/router';

@Component({
  selector: 'creative-document-asset-search',
  styleUrls: ['./creative-document-asset-search.component.scss'],
  templateUrl: './creative-document-asset-search.component.html',
})
export class CreativeDocumentAssetSearchComponent implements OnInit, OnDestroy {

  resultHeader: string;

  currentView: string = 'thumbnailView';

  defaultParams: any = {
    currentPageIndex: 0,
    pageSize: 20,
    ecm_path: '',
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  filters: any = {
    'the_loupe_main_assettype_agg': { placeholder: 'Asset Type' },
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'the_loupe_main_country_agg': { placeholder: 'County', iteration: true },
    'the_loupe_main_brand_agg': { placeholder: 'Brand' },
    'the_loupe_main_clientName_agg': { placeholder: 'Client' },
    'app_edges_industry_agg': { placeholder: 'Industry', iteration: true },
    'app_edges_backslash_category_agg': { placeholder: 'Category' },
    'app_edges_tags_edges_agg': { placeholder: 'Edges' },
  };

  private subscription: Subscription = new Subscription();

  afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => {
    if (res.action === 'afterSearch') {
      return this.advanceSearch.requestTitleByIds(res.response, ['The_Loupe_Main:campaign']).pipe(
        map((response: NuxeoPagination) => { res.response = response; return res; }),
      );
    }
    return observableOf(res);
  }

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected queryParamsService: SearchQueryParamsService) {
  }

  ngOnInit() {
    this.setResultHeader();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onResultViewChange(name: string): void {
    this.currentView = name;
  }

  private setResultHeader(): void {
    const subscription = this.queryParamsService.onQueryParamsChanged().subscribe((params: Params) => {
      if (params.hasOwnProperty('app_global_networkshare')) {
        this.resultHeader = `Best of TBWA\Worldwide`;
      } else {
        this.resultHeader = '';
      }
    });
    this.subscription.add(subscription);
  }

}
