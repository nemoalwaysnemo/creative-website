import { Component, OnInit, OnDestroy } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../../disruption-shared/tab-config';
import { NuxeoPagination, AdvanceSearch, DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';
@Component({
  selector: 'tbwa-disruption-roadmap-page',
  styleUrls: ['./disruption-roadmaps.component.scss'],
  templateUrl: './disruption-roadmaps.component.html',
})
export class DisruptionRoadmapsComponent implements OnInit, OnDestroy {
  nuxeoParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ROADMAP_TYPE,
    ecm_path: NUXEO_META_INFO.DISRUPTION_ROAD_PATH,
  };
  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_META_INFO.DISRUPTION_ROAD_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_BASE_FOLDER_TYPE,
  };
  parentDocument: DocumentModel;
  disruptionType = 'Distruption Roadmaps';

  tabs = TAB_CONFIG;

  private subscription: Subscription = new Subscription();

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
