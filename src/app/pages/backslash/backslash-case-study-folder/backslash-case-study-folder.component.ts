import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { DocumentModel, NuxeoPermission, SearchFilterModel } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings } from '@pages/shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../backslash-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-case-study-folder',
  styleUrls: ['./backslash-case-study-folder.component.scss'],
  templateUrl: './backslash-case-study-folder.component.html',
})
export class BackslashCaseStudyFolderComponent extends GlobalDocumentViewComponent {

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  baseParams$: Subject<any> = new Subject<any>();

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  showFolderInfo: boolean = false;

  filters: SearchFilterModel[] = [
    // new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
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
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_CASE_STUDIES_ALL_FOLDER_TYPE,
      ecm_mixinType_not_in: '',
      // ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
    };
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    if (doc.type === 'App-Backslash-Case-Study-Folder') {
      if (doc.hasFolderishChild) {
        return this.buildSubFolderParams(doc);
      } else {
        return this.buildCaseAssetParams(doc);
      }
    }
    if (doc.type === 'App-Backslash-Case-Study-Category') {
      return this.buildCategoryAssetParams(doc);
    }
    if (doc.type === 'App-Backslash-Case-Study-Region') {
      return this.buildRegionAssetParams(doc);
    }
    return {};
  }

  protected buildSubFolderParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_CASE_STUDIES_SUB_FOLDER_TYPE,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
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
      // ecm_mixinType_not_in: '', // override
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_CASE_STUDIES_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

  protected buildCategoryAssetParams(doc: DocumentModel): any {
    const params: any = {
      ecm_mixinType_not_in: '', // override
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_CASE_STUDIES_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['app_edges_backslash_category'] = '["' + [doc.get('app_Edges:backslash_category')].join('", "') + '"]';
    }
    return params;
  }

  protected buildRegionAssetParams(doc: DocumentModel): any {
    const params: any = {
      ecm_mixinType_not_in: '', // override
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_CASE_STUDIES_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['app_edges_report_region'] = '["' + [doc.get('app_Edges:report_region')].join('", "') + '"]';
    }
    return params;
  }

  showFolderButtons(doc: DocumentModel): boolean {
    if (doc !== undefined) {
      switch (doc.type) {
        case 'App-Backslash-Case-Study-Category':
          return false;
        case 'App-Backslash-Case-Study-Region':
          return false;
        case 'App-Backslash-Case-Study-Folder':
          return true;
        default:
          return true;
      }
    }
  }
}
