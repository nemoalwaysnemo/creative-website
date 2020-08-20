import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { DocumentModel, NuxeoPermission, SearchFilterModel, NuxeoSearchConstants } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings } from '@pages/shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../backslash-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-edge-folder',
  styleUrls: ['./backslash-edge-folder.component.scss'],
  templateUrl: './backslash-edge-folder.component.html',
})
export class BackslashEdgeFolderComponent extends GlobalDocumentViewComponent {

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
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_EDGE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_EDGE_FOLDER_TYPE,
      ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
    };
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    if (doc.type === 'App-Backslash-Resources-Assetfolder') {
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
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_EDGE_FOLDER_TYPE,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_EDGE_FOLDER_PATH,
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
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_EDGE_ASSET_TYPE,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_EDGE_FOLDER_PATH,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

}
