import { AdvanceSearchService, DocumentModel, NuxeoPermission } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { GlobalDocumentViewComponent } from './global-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, of as observableOf } from 'rxjs';
import { share } from 'rxjs/operators';

export class BaseDocumentManageComponent extends GlobalDocumentViewComponent {

  tabs: any[] = [];

  settings: any[] = [];

  formLayout: any = {};

  managePermission$: Observable<boolean> = observableOf(false);

  protected tabConfig: any[];

  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(advanceSearchService, activatedRoute, queryParamsService);
  }

  onInit() {
    super.onInit();
    this.performForm();
  }

  protected getSettings(): any[] {
    return [];
  }
  protected getFormLayout(): any {
    return {};
  }

  protected performForm(): void {
    this.settings = this.getSettings();
    this.formLayout = this.getFormLayout();
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

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_AGENCY_AND_BRAND_FOLDER_TYPE,
    };
  }
}