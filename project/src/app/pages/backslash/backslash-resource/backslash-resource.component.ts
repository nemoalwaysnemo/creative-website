import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, GlobalSearchParams } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { TAB_CONFIG } from '../backslash-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-resource',
  styleUrls: ['./backslash-resource.component.scss'],
  templateUrl: './backslash-resource.component.html',
})
export class BackslashResourceComponent extends GlobalDocumentViewComponent {

  tabConfig: any = TAB_CONFIG;

  baseParams$: Subject<any> = new Subject<any>();

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

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: this.documentPageService.getConfig('path:BACKSLASH_RESOURCES_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_RESOURCES_BASE_FOLDER_TYPE,
    };
  }

  protected buildDefaultAssetsParams(doc: DocumentModel): GlobalSearchParams {
    const params: any = {
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_mixinType_not_in: '',
      ecm_path: this.documentPageService.getConfig('path:BACKSLASH_RESOURCES_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_RESOURCES_SUB_FOLDER_TYPE,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new GlobalSearchParams(params);
  }

}
