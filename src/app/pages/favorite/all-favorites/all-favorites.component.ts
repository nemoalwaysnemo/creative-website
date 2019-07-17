import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, Observable, of as observableOf } from 'rxjs';
import { UserService, DocumentModel, NuxeoQuickFilters } from '@core/api';
import { PreviewDialogService, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../favorite-tab-config';
@Component({
  selector: 'all-favorites',
  templateUrl: './all-favorites.component.html',
  styleUrls: ['./all-favorites.component.scss'],
})
export class AllFavoritesComponent implements OnInit, OnDestroy {
  documents: any;
  tabs = TAB_CONFIG;
  baseParams$: Subject<any> = new Subject<any>();
  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_ROADMAPS_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ROADMAP_FOLDER_TYPE,
  };

  parentDocument: DocumentModel;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  filters: any = {
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'app_edges_industry_agg': { placeholder: 'Industry', iteration: true },
  };

  private subscription: Subscription = new Subscription();

  constructor(
    private previewDialogService: PreviewDialogService,
    private queryParamsService: SearchQueryParamsService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.getFavoriteId();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.parentDocument);
  }

  onCreated(doc: DocumentModel): void {
    this.queryParamsService.changeQueryParams({ refresh: true }, { type: 'refresh' }, 'merge');
  }

  private getFavoriteId() {
    this.userService.getFavoriteDocument()
      .subscribe((res) => {
        this.setCurrentDocument(res);
      });
  }

  private setCurrentDocument(doc) {
    this.baseParams$.next(this.buildAssetsParams(doc));
  }

  private buildAssetsParams(doc) {
    const params = {
      pageSize: 20,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['uuidAny'] = doc.uid;
    }
    return params;
  }
}
