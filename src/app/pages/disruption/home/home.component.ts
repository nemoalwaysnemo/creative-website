import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-disruption-page',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  nuxeoParams: any = {
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
    ecm_path: NUXEO_META_INFO.DISRUPTION_DAYS_PATH,
  };
}
