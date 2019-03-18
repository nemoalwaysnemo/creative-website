import { Component, OnInit, OnDestroy } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../../shared/tab-config';
import { NuxeoPagination, AdvanceSearch } from '@core/api';
import { Subscription } from 'rxjs';
@Component({
  selector: 'tbwa-disruption-page',
  styleUrls: ['./disruption-days.component.scss'],
  templateUrl: './disruption-days.component.html',
})
export class DisruptionDaysComponent implements OnInit, OnDestroy {
  nuxeoParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    quickFilters: 'ShowInNavigation',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
    ecm_path: NUXEO_META_INFO.DISRUPTION_DAYS_PATH,
  };

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.DISRUPTION_DAYS_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_BASE_FOLDER_TYPE,
  };
  
  tabs = TAB_CONFIG;
  pageType = 'disruptionDays';
  private subscription: Subscription = new Subscription();
  folderID: any;
  subDocTypes: string[];

  ngOnInit() {
    this.searchFolders(this.folderParams);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  constructor(private advanceSearch: AdvanceSearch) {}

  private searchFolders(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        const subTypes = [];
        for (const entry of res.entries[0].subTypes) {
          subTypes.push(entry['type']);
        }
        this.folderID = res.entries[0].uid;
        this.subDocTypes = subTypes;
      });
    this.subscription.add(subscription);
  }
}
