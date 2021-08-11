import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { GlobalSearchParams, DocumentModel } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { TAB_CONFIG } from '../backslash-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-trigger-pool',
  styleUrls: ['./backslash-trigger-pool.component.scss'],
  templateUrl: './backslash-trigger-pool.component.html',
})
export class BackslashTriggerPoolComponent extends GlobalDocumentViewComponent {

  tabConfig: any = TAB_CONFIG;

  baseParams$: Subject<any> = new Subject<any>();

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  filters: SearchFilterModel[] = [
    // new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    // new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildDefaultAssetsParams(doc)); });
    }
  }

  protected buildSearchAssetsParams(searchParams: GlobalSearchParams): GlobalSearchParams {
    const params: any = {
      currentPageIndex: searchParams.getSettings('append') ? searchParams.providerParams.currentPageIndex : 0,
      pageSize: searchParams.getSettings('append') ? searchParams.providerParams.pageSize : GlobalSearchParams.PageSize,
      ecm_mixinType_not_in: '',
      ecm_fulltext: searchParams.providerParams.ecm_fulltext_wildcard,
      ecm_path: this.documentPageService.getConfig('path:BACKSLASH_TRIGGER_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_TRIGGER_TYPE,
    };
    return searchParams.setParams(params);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: this.documentPageService.getConfig('path:BACKSLASH_TRIGGER_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_TRIGGER_SUB_FOLDER_TYPE,
    };
  }

  protected buildDefaultAssetsParams(doc: DocumentModel): GlobalSearchParams {
    const params: any = {
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_mixinType_not_in: '',
      ecm_path: this.documentPageService.getConfig('path:BACKSLASH_TRIGGER_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_TRIGGER_TYPE,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new GlobalSearchParams(params);
  }

}
