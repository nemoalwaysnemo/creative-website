import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, NuxeoSearchConstants } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalDocumentDialogService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { TAB_CONFIG } from '../disruption-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-days-folder',
  styleUrls: ['./disruption-days-folder.component.scss'],
  templateUrl: './disruption-days-folder.component.html',
})
export class DisruptionDaysFolderComponent extends GlobalDocumentViewComponent {

  tabConfig: any = TAB_CONFIG;

  baseParams$: Subject<any> = new Subject<any>();

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(activatedRoute, documentPageService);
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
      ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
      ecm_path: this.documentPageService.getConfig('path:DISRUPTION_DAYS_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_DAYS_TYPE,
    };
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_DAY_ASSET_TYPES,
      ecm_path: this.documentPageService.getConfig('path:DISRUPTION_DAYS_PATH'),
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

}
