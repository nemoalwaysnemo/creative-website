import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../../shared/tab-config';
@Component({
  selector: 'tbwa-disruption-roadmap-page',
  styleUrls: ['./disruption-roadmaps.component.scss'],
  templateUrl: './disruption-roadmaps.component.html',
})
export class DisruptionRoadmapsComponent {
  nuxeoParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_ROADMAPS_TYPE,
    ecm_path: NUXEO_META_INFO.DISRUPTION_ROAD_PATH,
  };
  disruptionType = 'roadmaps';
  tabs = TAB_CONFIG;
}
