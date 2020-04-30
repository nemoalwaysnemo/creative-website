import { Component, OnInit } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { AdvanceSearch, DocumentModel, NuxeoPageProviderParams, SearchFilterModel, NuxeoPageProviderConstants } from '@core/api';
import { SearchQueryParamsService, AbstractDocumentViewComponent } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../business-development-tab-config';
import { parseTabRoute } from '@core/services/helpers';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'biz-dev-thought-leadership-page',
  styleUrls: ['./biz-dev-thought-leadership.component.scss'],
  templateUrl: './biz-dev-thought-leadership.component.html',
})
export class BizDevThoughtLeadershipComponent extends AbstractDocumentViewComponent implements OnInit {

  baseParams$: Subject<any> = new Subject<any>();

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  ngOnInit() {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildDefaultAssetsParams(doc)); });
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: NUXEO_PATH_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_BASE_FOLDER_TYPE,
      ecm_mixinType_not_in: '', // override
    };
  }

  protected buildDefaultAssetsParams(doc?: DocumentModel): NuxeoPageProviderParams {
    const params = {
      pageSize: 20,
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_mixinType_not_in: '', // override
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_SUB_FOLDER_TYPE,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new NuxeoPageProviderParams(params);
  }

}
