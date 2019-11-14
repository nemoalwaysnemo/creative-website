import { AdvanceSearch, DocumentModel, NuxeoPermission } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { AbstractDocumentViewComponent } from './abstract-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, of as observableOf } from 'rxjs';
import { share } from 'rxjs/operators';

export abstract class AbstractDocumentManageComponent extends AbstractDocumentViewComponent {

  tabs: any[] = [];

  managePermission$: Observable<boolean> = observableOf(false);

  protected tabConfig: any[];

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  onInit() {
    super.onInit();
    this.parseTabRoute();
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      this.managePermission$ = this.hasPermission(doc);
      this.managePermission$.subscribe((hasPermission: boolean) => {
        if (!hasPermission) {
          this.queryParamsService.redirectTo403();
        }
      });
    }
  }

  protected hasPermission(doc: DocumentModel): Observable<boolean> {
    return combineLatest(
      doc.hasPermission(NuxeoPermission.ReadWrite),
      doc.hasPermission(NuxeoPermission.Everything),
      (one, two) => (one || two),
    ).pipe(share());
  }

  protected parseTabRoute(): void {
    if (this.tabs.length === 0) {
      const params: any = this.activatedRoute.snapshot.params;
      for (const config of this.tabConfig) {
        const tab: any = { title: config['title'], route: config['route'] };
        for (const key of ['type', 'id']) {
          tab['route'] = tab.route.replace(`:${key}`, params[key]);
        }
        this.tabs.push(tab);
      }
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPES,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_AGENCY_AND_BRAND_FOLDER_TYPE,
    };
  }
}
