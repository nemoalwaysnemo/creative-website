import { Component, OnInit, OnDestroy } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../../disruption-shared/tab-config';
import { NuxeoPagination, AdvanceSearch, DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';
@Component({
  selector: 'tbwa-disruption-theory-page',
  styleUrls: ['./disruption-theory.component.scss'],
  templateUrl: './disruption-theory.component.html',
})
export class DisruptionTheoryComponent implements OnInit, OnDestroy {
  nuxeoParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THEORY_TYPE,
    ecm_path: NUXEO_META_INFO.DISRUPTION_THEORY_PATH,
  };
  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.DISRUPTION_THEORY_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_BASE_FOLDER_TYPE,
  };
  disruptionType = 'Distruption Theory';
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
