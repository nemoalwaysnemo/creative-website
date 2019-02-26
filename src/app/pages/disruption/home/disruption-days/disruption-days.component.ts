import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFiG } from '../../shared/tab-config';
@Component({
  selector: 'tbwa-disruption-page',
  styleUrls: ['./disruption-days.component.scss'],
  templateUrl: './disruption-days.component.html',
})
export class DisruptionDaysComponent {
  nuxeoParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
    ecm_path: NUXEO_META_INFO.DISRUPTION_DAYS_PATH,
  };
  tabs = TAB_CONFiG;
}
