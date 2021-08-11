import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { DocumentModel, NuxeoPermission, NuxeoSearchConstants } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../business-development-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'biz-dev-case-study-folder',
  styleUrls: ['./biz-dev-case-study-folder.component.scss'],
  templateUrl: './biz-dev-case-study-folder.component.html',
})
export class BizDevCaseStudyFolderComponent extends GlobalDocumentViewComponent {

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  baseParams$: Subject<any> = new Subject<any>();

  addChildrenPermission$: Observable<boolean> = observableOf(false);

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
  ) {
    super(activatedRoute, documentPageService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc)); });
      this.addChildrenPermission$ = !doc.hasFolderishChild ? doc.hasPermission(NuxeoPermission.AddChildren) : observableOf(false);
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: this.documentPageService.getConfig('path:BIZ_DEV_CASE_STUDIES_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_CASE_STUDIES_FOLDER_TYPE,
      ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
    };
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    if (doc.type === 'App-BizDev-CaseStudy-Folder') {
      if (doc.hasFolderishChild) {
        return this.buildSubFolderParams(doc);
      } else {
        return this.buildCaseAssetParams(doc);
      }
    }
    return {};
  }

  protected buildSubFolderParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_CASE_STUDIES_FOLDER_TYPE,
      ecm_path: this.documentPageService.getConfig('path:BIZ_DEV_CASE_STUDIES_FOLDER_PATH'),
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

  protected buildCaseAssetParams(doc: DocumentModel): any {
    const params: any = {
      ecm_mixinType_not_in: '', // override
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_CASE_STUDIES_ASSET_TYPE,
      ecm_path: this.documentPageService.getConfig('path:BIZ_DEV_CASE_STUDIES_FOLDER_PATH'),
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

}
