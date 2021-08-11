import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, GlobalSearchParams } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { TAB_CONFIG } from '../backslash-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-trigger-pool-view',
  templateUrl: './backslash-trigger-pool-view.component.html',
  styleUrls: ['./backslash-trigger-pool-view.component.scss'],
})
export class BackslashTriggerPoolViewComponent extends GlobalDocumentViewComponent {

  tabConfig: any = TAB_CONFIG;

  baseParams$: Subject<any> = new Subject<any>();

  viewerSettings: any = {
  };

  filters: SearchFilterModel[] = [
    // new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
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
      ecm_path: this.documentPageService.getConfig('path:BACKSLASH_TRIGGER_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_TRIGGER_TYPE,
    };
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    const params: any = {
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_path: this.documentPageService.getConfig('path:BACKSLASH_TRIGGER_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_TRIGGER_TYPE,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new GlobalSearchParams(params);
  }
}
