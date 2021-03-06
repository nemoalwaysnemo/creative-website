import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of as observableOf, forkJoin, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NuxeoPagination, GlobalSearchParams, DocumentModel } from '@core/api';
import { GlobalDocumentDialogService, GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { NUXEO_DOC_TYPE } from '@environment/environment';

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
    // new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', visibleFn: (searchParams: GlobalSearchParams): boolean => searchParams.hasFilter('the_loupe_main_brand_agg') }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search for marketing reports, data, research...',
  });

  defaultParams: any = {
    currentPageIndex: 0,
    ecm_path: this.documentPageService.getConfig('path:INTELLIGENCE_BASE_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE,
    ecm_fulltext: '',
  };

  private folderParams: any = {
    pageSize: 3,
    currentPageIndex: 0,
    ecm_path: this.documentPageService.getConfig('path:INTELLIGENCE_BASE_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_FOLDER_TYPE,
  };

  private brandsParams: any = {
    pageSize: 15,
    currentPageIndex: 0,
    ecm_path: this.documentPageService.getConfig('path:INTELLIGENCE_BASE_FOLDER_PATH'),
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
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
  }

  private searchFolders(): void {
    forkJoin([
      this.search(this.folderParams),
      this.search(this.brandsParams),
    ]).pipe(
      map((docsList: DocumentModel[][]) => [].concat.apply([], docsList)),
    ).subscribe((docs: DocumentModel[]) => {
      this.folders = docs;
      this.loading = false;
    });
  }

  private search(params: any = {}): Observable<DocumentModel[]> {
    return this.documentPageService.advanceRequest(new GlobalSearchParams(params)).pipe(
      map((res: NuxeoPagination) => res.entries),
    );
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: this.documentPageService.getConfig('path:INTELLIGENCE_BASE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.INTELLIGENCE_BASE_FOLDER_TYPE,
    };
  }

  // no use?
  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: false });
  }

}
