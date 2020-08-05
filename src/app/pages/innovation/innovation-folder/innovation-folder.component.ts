import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { DocumentModel, NuxeoPermission, SearchFilterModel, GlobalSearchParams, NuxeoSearchConstants } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings } from '@pages/shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../innovation-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'innovation-folder',
  styleUrls: ['./innovation-folder.component.scss'],
  templateUrl: './innovation-folder.component.html',
})
export class InnovationFolderComponent extends GlobalDocumentViewComponent {

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  baseParams$: Subject<any> = new Subject<any>();

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
      this.assetUrl = this.buildRedirectUrl();
    }
  }

  protected getCurrentDocumentSearchParams(): GlobalSearchParams {
    const params: any = {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_path: this.getPath(),
      ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
      ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_FOLDER_TYPE,
    };

    return new GlobalSearchParams(params);
  }

  protected buildAssetsParams(doc: DocumentModel): any {
    const params: any = {
      ecm_mixinType_not_in: '', // override
      ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_SEARCH_TYPE,
      ecm_path: this.getPath(),
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return params;
  }

  protected getPath(): string {
    return this.documentPageService.getCurrentUrl().includes('/NEXT') ? NUXEO_PATH_INFO.INNOVATION_NEXT_FOLDER_PATH : NUXEO_PATH_INFO.INNOVATION_THINGS_TO_STEAL_FOLDER_PATH;
  }

  protected buildRedirectUrl(): string {
    let path: string;
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
