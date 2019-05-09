import { Component, OnInit, OnDestroy } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../tab-config';
import { NuxeoPagination, AdvanceSearch, DocumentModel, NuxeoPermission } from '@core/api';
import { Subscription, Observable } from 'rxjs';
import { PreviewDialogService, SearchQueryParamsService } from '@pages/shared';
@Component({
  selector: 'disruption-brilliant-thinking-page',
  styleUrls: ['./brilliant-thinking.component.scss'],
  templateUrl: './brilliant-thinking.component.html',
})
export class BrilliantThinkingComponent implements OnInit, OnDestroy {

  defaultParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THINKING_TYPE,
    ecm_path: NUXEO_META_INFO.DISRUPTION_THINKING_PATH,
  };

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.DISRUPTION_THINKING_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THINKING_FOLDER_TYPE,
  };

  tabs = TAB_CONFIG;

  parentDocument: DocumentModel;

  addChildren$: Observable<boolean>;

  filters: any = {
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
  };

  private subscription: Subscription = new Subscription();

  constructor(private advanceSearch: AdvanceSearch,
    private previewDialogService: PreviewDialogService,
    private queryParamsService: SearchQueryParamsService,
  ) { }

  ngOnInit() {
    this.searchFolders(this.folderParams);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private searchFolders(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.parentDocument = res.entries.shift();
        this.addChildren$ = this.parentDocument.hasPermission(NuxeoPermission.AddChildren);
      });
    this.subscription.add(subscription);
  }

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.parentDocument);
  }

  onCreated(doc: DocumentModel): void {
    this.queryParamsService.changeQueryParams({ refresh: true }, { type: 'refresh' }, 'merge');
  }

}
