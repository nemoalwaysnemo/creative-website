import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { DocumentModel, NuxeoPageProviderParams, SearchFilterModel, NuxeoRequestOptions, NuxeoPermission, NuxeoPageProviderConstants } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../innovation-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'innovation-list',
  styleUrls: ['./innovation-list.component.scss'],
  templateUrl: './innovation-list.component.html',
})
export class InnovationListComponent extends GlobalDocumentViewComponent implements OnInit {

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  baseParams$: Subject<any> = new Subject<any>();

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  assetUrl: string;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  beforeSearch: Function = (searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions): { searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => {
    if (searchParams.hasKeyword()) {
      searchParams = this.buildSearchAssetsParams(searchParams);
    }
    return { searchParams, opts };
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  ngOnInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  // get all matched assets and their parent folders
  protected buildSearchAssetsParams(queryParams: NuxeoPageProviderParams): NuxeoPageProviderParams {
    const params = {
      pageSize: 20,
      currentPageIndex: 0,
      ecm_mixinType_not_in: '',
      ecm_fulltext: queryParams.ecm_fulltext_wildcard,
      ecm_path: this.getPath(),
      ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_SEARCH_TYPE,
    };
    return new NuxeoPageProviderParams(params);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      this.addChildrenPermission$ = doc.hasPermission(NuxeoPermission.AddChildren);
      timer(0).subscribe(() => { this.baseParams$.next(this.buildDefaultAssetsParams(doc)); });
      this.assetUrl = this.getRedirectUrl();
    }
  }

  protected getCurrentDocumentSearchParams(): NuxeoPageProviderParams {
    const params = {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_path_eq: this.getPath(),
      ecm_mixinType: NuxeoPageProviderConstants.HiddenInNavigation,
      ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_FOLDER_TYPE,
    };

    return new NuxeoPageProviderParams(params);
  }

  protected buildDefaultAssetsParams(doc: DocumentModel): NuxeoPageProviderParams {
    const params = {
      pageSize: 20,
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_mixinType_not_in: '',
      ecm_path: this.getPath(),
      ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_SEARCH_TYPE,
    };

    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new NuxeoPageProviderParams(params);
  }

  protected getPath(): string {
    let path: string;
    const url = decodeURI(this.documentPageService.getCurrentUrl());
    if (url.includes('/NEXT')) {
      path = NUXEO_PATH_INFO.INNOVATION_NEXT_FOLDER_PATH;
    } else if (url.includes('/Things to Steal')) {
      path = NUXEO_PATH_INFO.INNOVATION_THINGS_TO_STEAL_FOLDER_PATH;
    }
    return path;
  }

  protected getRedirectUrl(): string {
    return this.documentPageService.getCurrentUrl().split('?')[0] + '/folder/';
  }

}
