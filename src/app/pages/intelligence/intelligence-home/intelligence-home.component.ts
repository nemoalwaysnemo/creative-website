import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { NuxeoPagination, AdvanceSearch, NuxeoPageProviderParams, SearchFilterModel, DocumentModel } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { GlobalDocumentDialogService, AbstractDocumentViewComponent, SearchQueryParamsService, GlobalSearchFormSettings } from '@pages/shared';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'disruption-home',
  styleUrls: ['./intelligence-home.component.scss'],
  templateUrl: './intelligence-home.component.html',
})
export class IntelligenceHomeComponent extends AbstractDocumentViewComponent implements OnInit, OnDestroy {

  loading: boolean = true;

  headline = 'All brains on deck.';

  subHead = 'Before we disrupt, we do our homework.';

  folders: DocumentModel[] = [];

  brands: DocumentModel[] = [];

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_intelligence_type_agg', placeholder: 'Intelligence Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Backslash Category' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    // new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    // new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', visibleFn: (searchParams: NuxeoPageProviderParams): boolean => searchParams.hasFilter('the_loupe_main_brand_agg') }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search for marketing reports, data, research...',
    enableQueryParams: false,
  });

  defaultParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE,
    ecm_fulltext: '',
  };

  private folderParams: any = {
    pageSize: 3,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_FOLDER_TYPE,
  };

  private brandsParams: any = {
    pageSize: 15,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_BRANDS_TYPE,
  };

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    protected globalDocumentDialogService: GlobalDocumentDialogService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  ngOnInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
    this.searchFolders();
  }

  private searchFolders(): void {
    forkJoin(
      this.search(this.folderParams),
      this.search(this.brandsParams),
    ).pipe(
      map((docsList: DocumentModel[][]) => [].concat.apply([], docsList)),
    ).subscribe((docs: DocumentModel[]) => {
      this.folders = docs;
      this.loading = false;
    });
  }

  private search(params: {}): Observable<DocumentModel[]> {
    return this.advanceSearch.request(new NuxeoPageProviderParams(params)).pipe(
      map((res: NuxeoPagination) => res.entries),
    );
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.INTELLIGENCE_BASE_FOLDER_TYPE,
    };
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
