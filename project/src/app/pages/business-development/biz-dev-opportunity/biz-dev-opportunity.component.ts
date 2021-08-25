import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { DocumentModel } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../business-development-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'biz-dev-opportunity',
  styleUrls: ['./biz-dev-opportunity.component.scss'],
  templateUrl: './biz-dev-opportunity.component.html',
})
export class BizDevOpportunityComponent extends GlobalDocumentViewComponent implements OnInit {

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  baseParams$: Subject<any> = new Subject<any>();

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  filters: SearchFilterModel[] = [
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

  ngOnInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc)); });
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: this.documentPageService.getConfig('path:BIZ_DEV_OPPORTUNITY_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_OPPORTUNITIES_FOLDER_TYPE,
    };
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_OPPORTUNITY_FOLDER_TYPE,
      ecm_mixinType_not_in: '',
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    return params;
  }

}
