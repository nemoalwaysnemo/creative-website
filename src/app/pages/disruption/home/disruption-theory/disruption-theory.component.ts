import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../../shared/tab-config';
@Component({
  selector: 'tbwa-disruption-theory-page',
  styleUrls: ['./disruption-theory.component.scss'],
  templateUrl: './disruption-theory.component.html',
})
export class DisruptionTheoryComponent {
  nuxeoParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAY_TYPE,
    ecm_path: NUXEO_META_INFO.DISRUPTION_THEORY_PATH,
  };
  disruptionType = 'theory';
  tabs = TAB_CONFIG;
}
