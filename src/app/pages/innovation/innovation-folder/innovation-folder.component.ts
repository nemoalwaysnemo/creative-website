import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { DocumentModel, AdvanceSearchService, NuxeoPermission, SearchFilterModel, NuxeoPageProviderParams } from '@core/api';
import { GlobalDocumentViewComponent, SearchQueryParamsService, GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../innovation-tab-config';
import { parseTabRoute } from '@core/services/helpers';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'innovation-folder',
  styleUrls: ['./innovation-folder.component.scss'],
  templateUrl: './innovation-folder.component.html',
})
export class InnovationFolderComponent extends GlobalDocumentViewComponent {

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  baseParams$: Subject<any> = new Subject<any>();

  currentUrl: string = this.router.url;

  assetUrl: string;

  deleteRedirectUrl: string;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(
    private router: Router,
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearchService, activatedRoute, queryParamsService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc)); });
      this.addChildrenPermission$ = !doc.hasFolderishChild ? doc.hasPermission(NuxeoPermission.AddChildren) : observableOf(false);
      this.assetUrl = this.buildRedirectUrl();
    }
  }

  protected getCurrentDocumentSearchParams(): NuxeoPageProviderParams {
    const params = {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_mixinType_not_in: '',
      ecm_path: this.setPath(),
      ecm_primaryType: NUXEO_META_INFO.INNOVATION_FOLDER_TYPE,
    };

    return new NuxeoPageProviderParams(params);
  }

  protected buildAssetsParams(doc?: DocumentModel): any {
    if (doc.type === 'App-Innovation-Folder') {
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
      ecm_primaryType: NUXEO_META_INFO.INNOVATION_FOLDER_TYPE,
      ecm_path: this.setPath(),
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
      ecm_primaryType: NUXEO_META_INFO.INNOVATION_ASSET_TYPE,
      ecm_path: this.setPath(),
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

  protected setPath(): string {
    return this.currentUrl.includes('/NEXT') ? NUXEO_PATH_INFO.INNOVATION_NEXT_FOLDER_PATH : NUXEO_PATH_INFO.INNOVATION_THINGS_TO_STEAL_FOLDER_PATH;
  }

  protected buildRedirectUrl(): string {
    let path;
    const url = decodeURI(window.location.href.split('#')[1].split('?')[0]);
    if (url.includes('/NEXT')) {
      path = '/p/innovation/NEXT/folder/';
      this.deleteRedirectUrl = '/p/innovation/NEXT/';
    } else if (url.includes('/Things to Steal')) {
      path = '/p/innovation/Things to Steal/folder/';
      this.deleteRedirectUrl = '/p/innovation/Things to Steal/';
    }
    return path;
  }

}
