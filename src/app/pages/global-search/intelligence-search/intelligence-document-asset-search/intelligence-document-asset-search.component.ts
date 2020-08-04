import { Component } from '@angular/core';
import { SearchFilterModel, GlobalSearchParams } from '@core/api';
import { Subject, timer } from 'rxjs';
import { GlobalSearchFormSettings, DocumentPageService, GlobalSearchSettings } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'intelligence-document-asset-search',
  styleUrls: ['./intelligence-document-asset-search.component.scss'],
  templateUrl: './intelligence-document-asset-search.component.html',
})
export class IntelligenceDocumentAssetSearchComponent extends BaseDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  placeholder: string = 'Search in title, description and tags only...';

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'ecm_tag_agg', placeholder: 'Tag' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_intelligence_type_agg', placeholder: 'Intelligence Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Backslash Category' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
    this.triggerSearch();
  }

  onKeyup(event: any): void {
    this.triggerSearch(event.target.value.trim(), new GlobalSearchSettings({
      fulltextKey: 'intelligence_fulltext',
      enableQueryParams: false,
      syncFormValue: false,
      showFilter: true,
    }));
  }

  private triggerSearch(searchTerm: string = '', settings?: GlobalSearchSettings) {
    timer(0).subscribe(() => { this.baseParams$.next(this.buildSearchParams(searchTerm, settings)); });
  }

  private buildSearchParams(searchTerm: string = '', settings?: GlobalSearchSettings): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      currentPageIndex: 0,
      ecm_fulltext: searchTerm,
    };
    return new GlobalSearchParams(params, settings);
  }
}
