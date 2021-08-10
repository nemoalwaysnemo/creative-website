import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { parseTabRoute } from '@core/services/helpers';
import { DocumentModel, GlobalSearchParams, NuxeoRequestOptions, NuxeoSearchConstants } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { TAB_CONFIG } from '../innovation-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'innovation-list',
  styleUrls: ['./innovation-list.component.scss'],
  templateUrl: './innovation-list.component.html',
})
export class InnovationListComponent extends GlobalDocumentViewComponent implements OnInit {

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

  beforeSearch: (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions) => { searchParams: GlobalSearchParams; opts: NuxeoRequestOptions } = (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions) => {
    if (searchParams.hasKeyword()) {
      searchParams = this.buildSearchAssetsParams(searchParams);
    }
    return { searchParams, opts };
  };

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
  protected buildSearchAssetsParams(searchParams: GlobalSearchParams): GlobalSearchParams {
    const params: any = {
      currentPageIndex: searchParams.getSettings('append') ? searchParams.providerParams.currentPageIndex : 0,
      pageSize: searchParams.getSettings('append') ? searchParams.providerParams.pageSize : GlobalSearchParams.PageSize,
      ecm_fulltext: searchParams.providerParams.ecm_fulltext_wildcard,
      ecm_mixinType_not_in: '',
      ecm_path: this.getPath(),
      ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_SEARCH_TYPE,
    };
    return searchParams.setParams(params);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildDefaultAssetsParams(doc)); });
      this.assetUrl = this.getRedirectUrl();
    }
  }

  protected getCurrentDocumentSearchParams(): GlobalSearchParams {
    const params: any = {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_path_eq: this.getPath(),
      ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
      ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_FOLDER_TYPE,
    };

    return new GlobalSearchParams(params);
  }

  protected buildDefaultAssetsParams(doc: DocumentModel): GlobalSearchParams {
    const params: any = {
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_mixinType_not_in: '',
      ecm_path: this.getPath(),
      ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_SEARCH_TYPE,
    };

    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new GlobalSearchParams(params);
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
