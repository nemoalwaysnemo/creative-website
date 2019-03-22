import { Component, OnInit, OnDestroy } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../../disruption-shared/tab-config';
import { NuxeoPagination, AdvanceSearch, DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';
@Component({
  selector: 'tbwa-brilliant-thinking-page',
  styleUrls: ['./brilliant-thinking.component.scss'],
  templateUrl: './brilliant-thinking.component.html',
})
export class BrilliantThinkingComponent implements OnInit, OnDestroy {
  nuxeoParams: any = {
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
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_BASE_FOLDER_TYPE,
  };

  disruptionType = 'Brilliant Thinking';
  tabs = TAB_CONFIG;
  private subscription: Subscription = new Subscription();
  parentDocument: DocumentModel;

  constructor(private advanceSearch: AdvanceSearch) { }

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
      });
    this.subscription.add(subscription);
  }
}
