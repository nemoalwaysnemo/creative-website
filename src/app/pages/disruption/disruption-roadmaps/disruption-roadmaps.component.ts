import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, of as observableOf } from 'rxjs';
import { NuxeoPagination, AdvanceSearch, DocumentModel, NuxeoPermission, NuxeoQuickFilters } from '@core/api';
import { PreviewDialogService, SearchQueryParamsService } from '@pages/shared';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../disruption-tab-config';

@Component({
  selector: 'disruption-roadmap-page',
  styleUrls: ['./disruption-roadmaps.component.scss'],
  templateUrl: './disruption-roadmaps.component.html',
})
export class DisruptionRoadmapsComponent implements OnInit, OnDestroy {

  defaultParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ROADMAP_TYPE,
    ecm_path: NUXEO_META_INFO.DISRUPTION_ROADMAPS_PATH,
    quickFilters: `${NuxeoQuickFilters.HiddenInNavigation},${NuxeoQuickFilters.Alphabetically}`,
  };

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.DISRUPTION_ROADMAPS_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ROADMAP_FOLDER_TYPE,
  };

  tabs = TAB_CONFIG;

  parentDocument: DocumentModel;

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  filters: any = {
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
  };

  private subscription: Subscription = new Subscription();

  constructor(
    private advanceSearch: AdvanceSearch,
    private previewDialogService: PreviewDialogService,
    private queryParamsService: SearchQueryParamsService,
  ) { }

  ngOnInit() {
    this.searchFolders(this.folderParams);
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

  private searchFolders(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.parentDocument = res.entries.shift();
        if (this.parentDocument) {
          this.addChildrenPermission$ = this.parentDocument.hasPermission(NuxeoPermission.AddChildren);
        }
      });
    this.subscription.add(subscription);
  }
}
