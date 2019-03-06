import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { AdvanceSearch, NuxeoPagination, DocumentModel, NuxeoPageProviderParams } from '@core/api';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
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
      uid: '436e90fc-3216-4ae7-a15d-8b95d02b5550',
      thumbnailUrl: 'http://img2.imgtn.bdimg.com/it/u=2940606656,3811047262&fm=26&gp=0.jpg',
    },
    {
      title: 'Consumer',
      uid: '23f32516-519f-48cc-9085-ef3acae560e1',
      thumbnailUrl: 'http://img5.imgtn.bdimg.com/it/u=2116141515,3765317058&fm=26&gp=0.jpg',
    },
    {
      title: 'Marketing',
      uid: '35b5a797-c280-4b11-92fc-5eede32bf3ce',
      thumbnailUrl: 'http://img5.imgtn.bdimg.com/it/u=305713512,2117722925&fm=26&gp=0.jpg',
    },
  ];
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

}
