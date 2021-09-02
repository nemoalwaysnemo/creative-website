import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPermission, NuxeoSearchConstants } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { Observable, of as observableOf } from 'rxjs';
import { TAB_CONFIG } from '../disruption-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-x-days',
  styleUrls: ['./disruption-x-days.component.scss'],
  templateUrl: './disruption-x-days.component.html',
})
export class DisruptionXDaysComponent extends GlobalDocumentViewComponent implements OnInit {

  tabConfig: any = TAB_CONFIG;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

  defaultParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: this.documentPageService.getConfig('path:DISRUPTION_X_DAYS_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_DAYS_TYPE,
    ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
  };

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
      this.addChildrenPermission$ = doc.hasPermission(NuxeoPermission.AddChildren);
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: this.documentPageService.getConfig('path:DISRUPTION_X_DAYS_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_X_DAYS_TYPE,
    };
  }

}
