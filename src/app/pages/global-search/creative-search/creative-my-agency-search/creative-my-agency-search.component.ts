import { Component, OnInit } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { Subject, timer, Observable } from 'rxjs';
import { AdvanceSearch, DocumentModel, UserService, NuxeoPageProviderParams, NuxeoRequestOptions, UserModel, SearchFilterModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'creative-my-agency-search',
  templateUrl: './creative-my-agency-search.component.html',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
})
export class CreativeMyAgencySearchComponent extends AbstractDocumentViewComponent implements OnInit {

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'third';

  userInfo: any = {};

  showInput: boolean = false;

  resultHeader: string;

  caseFlag: boolean = true;

  showType: string = 'showcase';

  filters: SearchFilterModel[] = [
    // new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    // new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    // new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'County', iteration: true }),
    // new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    // new SearchFilterModel({ key: 'the_loupe_main_clientName_agg', placeholder: 'Client' }),
    // new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    // new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    // new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  constructor(
    private userService: UserService,
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  ngOnInit() {
    this.searchCurrentAgency().subscribe();
  }

  toggleBtn(): void {
    this.caseFlag = !this.caseFlag;
    this.queryParamsService.clearQueryParams();
    if (!this.caseFlag) {
      this.showType = 'brands';
      this.resultHeader = 'Brands:';
      this.baseParams$.next(this.buildBrandParams(this.userInfo));
    } else {
      this.showType = 'showcase';
      this.resultHeader = 'Showcase:';
      this.baseParams$.next(this.buildCaseParams(this.userInfo));
    }
  }

  protected setCurrentDocument(doc?: DocumentModel): void {
    this.document = doc;
    if (doc) {
      this.resultHeader = 'Showcase:';
      timer(0).subscribe(() => { this.baseParams$.next(this.buildCaseParams(this.userInfo)); });
    }
  }

  protected searchCurrentAgency(): Observable<DocumentModel> {
    return this.userService.getCurrentUserInfo().pipe(
      tap((user: UserModel) => this.userInfo = user.properties),
      switchMap((user: UserModel) => this.searchCurrentDocument(this.getSearchParams(user))),
    );
  }

  private getSearchParams(user: UserModel): NuxeoPageProviderParams {
    const params = {
      pageSize: 1,
      ecm_fulltext: '',
      currentPageIndex: 0,
      the_loupe_main_companycode: user.get('companycode'),
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPES,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_AGENCY_FOLDER_TYPE,
    };
    return new NuxeoPageProviderParams(params);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {};
  }

  protected buildBrandParams(user: any): NuxeoPageProviderParams {
    const params = {
      pageSize: 20,
      the_loupe_main_companycode: user.companycode,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPES,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_BRAND_FOLDER_TYPE,
      ecm_fulltext: '',
      currentPageIndex: 0,
      app_global_networkshare: true,
    };
    return new NuxeoPageProviderParams(params);
  }

  protected buildCaseParams(user: any): NuxeoPageProviderParams {
    const params = {
      pageSize: 20,
      the_loupe_main_companycode: user.companycode,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      ecm_fulltext: '',
      currentPageIndex: 0,
      app_global_networkshare: true,
    };
    return new NuxeoPageProviderParams(params);
  }

}
