import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { DocumentModel, AdvanceSearch, NuxeoPermission, NuxeoEnricher, SearchFilterModel, NuxeoPageProviderConstants } from '@core/api';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../business-development-tab-config';
import { parseTabRoute } from '@core/services/helpers';

@Component({
  selector: 'biz-dev-case-study-folder',
  styleUrls: ['./biz-dev-case-study-folder.component.scss'],
  templateUrl: './biz-dev-case-study-folder.component.html',
})
export class BizDevCaseStudyFolderComponent extends AbstractDocumentViewComponent {

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  baseParams$: Subject<any> = new Subject<any>();

  addChildrenPermission$: Observable<boolean> = observableOf(false);

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

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc)); });
      this.addChildrenPermission$ = !doc.hasFolderishChild ? doc.hasPermission(NuxeoPermission.AddChildren) : observableOf(false);
    }
  }

  protected getCurrentDocumentRequestParams(): any {
    return {
      enrichers: {
        document: [
          NuxeoEnricher.document.PREVIEW,
          NuxeoEnricher.document.THUMBNAIL,
          NuxeoEnricher.document.FAVORITES,
          NuxeoEnricher.document.PERMISSIONS,
          NuxeoEnricher.document.HAS_FOLDERISH_CHILD,
          // NuxeoEnricher.document.HAS_CONTENT,
        ],
      },
    };
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_TYPE,
    };
  }

  protected buildAssetsParams(doc?: DocumentModel): any {
    if (doc.type === 'App-BizDev-CaseStudy-Folder') {
      if (doc.hasFolderishChild) {
        return this.buildSubFolderParams(doc);
      } else {
        return this.buildCaseAssetParams(doc);
      }
    }
    return {};
  }

  protected buildSubFolderParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_TYPE,
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_PATH,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

  protected buildCaseAssetParams(doc?: DocumentModel): any {
    const params = {
      ecm_mixinType_not_in: '', // override
      ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_CASE_STUDIES_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_PATH,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

}
