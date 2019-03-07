import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-disruption-page',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  document: any;
  headline = 'What are you looking for today?';
  folders = [
    {
      title: 'Industry',
      uid: NUXEO_META_INFO.INTELLIGENCE_INDUSTRY_UID,
      thumbnailUrl: 'http://img2.imgtn.bdimg.com/it/u=2940606656,3811047262&fm=26&gp=0.jpg',
    },
    {
      title: 'Consumer',
      uid: NUXEO_META_INFO.INTELLIGENCE_CONSUMER_UID,
      thumbnailUrl: 'http://img5.imgtn.bdimg.com/it/u=2116141515,3765317058&fm=26&gp=0.jpg',
    },
    {
      title: 'Marketing',
      uid: NUXEO_META_INFO.INTELLIGENCE_MARKETING_UID,
      thumbnailUrl: 'http://img5.imgtn.bdimg.com/it/u=305713512,2117722925&fm=26&gp=0.jpg',
    },
  ];
}
