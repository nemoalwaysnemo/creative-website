import { Component, OnInit, OnDestroy } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../tab-config';
import { NuxeoPagination, AdvanceSearch, DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';
import { PreviewDialogService } from '@pages/shared';
@Component({
  selector: 'tbwa-disruption-theory-page',
  styleUrls: ['./disruption-theory.component.scss'],
  templateUrl: './disruption-theory.component.html',
})
export class DisruptionTheoryComponent implements OnInit, OnDestroy {

  defaultParams: any = {
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
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_THEORY_FOLDER_TYPE,
  };

  tabs = TAB_CONFIG;

  parentDocument: DocumentModel;

  filters: any = {
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
  };

  private subscription: Subscription = new Subscription();

  constructor(private advanceSearch: AdvanceSearch, private previewDialogService: PreviewDialogService) { }

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

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.parentDocument);
  }

}
