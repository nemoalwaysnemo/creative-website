import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of as observableOf, forkJoin, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { NuxeoPagination, NuxeoPageProviderParams, SearchFilterModel, DocumentModel, NuxeoPermission } from '@core/api';
import { GlobalDocumentDialogService, GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, GlobalSearchSettings } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-home',
  styleUrls: ['./intelligence-home.component.scss'],
  templateUrl: './intelligence-home.component.html',
})
export class IntelligenceHomeComponent extends GlobalDocumentViewComponent {

  loading: boolean = true;

  openSearchFilter: boolean = true;

  headline: string = 'All brains on deck.';

  subHead: string = 'Before we disrupt, we do our homework.';

  placeholder: string = 'Search in title, description and tags only...';

  folders: DocumentModel[] = [];

  brands: DocumentModel[] = [];

  baseParams$: Subject<any> = new Subject<any>();

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'ecm_tag_agg', placeholder: 'Tag' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
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
  });

  private folderParams: any = {
    pageSize: 3,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_FOLDER_TYPE,
  };

  private brandsParams: any = {
    pageSize: 15,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_BRANDS_TYPE,
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
    this.searchFolders();
    this.triggerSearch();
  }


  onKeyEnter(event: KeyboardEvent): void {
    // const params = this.buildQueryParams(this.openSearchFilter ? { showFilter: true } : {});
    // this.redirectToListPage(params);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  onKeyup(event: any): void {
    this.triggerSearch(event.target.value.trim(), new GlobalSearchSettings({ fulltextKey: 'intelligence_fulltext', syncFormValue: false }));
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      this.addChildrenPermission$ = doc.hasPermission(NuxeoPermission.Write);
    }
  }

  private triggerSearch(searchTerm: string = '', settings?: GlobalSearchSettings) {
    timer(0).subscribe(() => { this.baseParams$.next(this.buildSearchParams(searchTerm, settings)); });
  }

  private buildSearchParams(searchTerm: string = '', settings?: GlobalSearchSettings): any {
    const params = {
      pageSize: 20,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE,
      ecm_fulltext: searchTerm,
    };
    if (settings) {
      params['searchSettings'] = settings;
    }
    return params;
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
    return this.documentPageService.advanceRequest(new NuxeoPageProviderParams(params)).pipe(
      map((res: NuxeoPagination) => res.entries),
    );
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: NUXEO_PATH_INFO.INTELLIGENCE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_BASE_FOLDER_TYPE,
    };
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

}
