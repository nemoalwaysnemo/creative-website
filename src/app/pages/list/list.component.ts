import { Component, OnDestroy } from '@angular/core';
import { NuxeoApiService } from '@core/api';

@Component({
  selector: 'tbwa-list-page',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html',
})
export class ListComponent implements OnDestroy {

  private alive: boolean = true;

  constructor(private nuxeoApi: NuxeoApiService) {
    const token = '5ee79339-b07c-408b-90cd-30484ef02688';
    // const username = 'Administrator';
    // const password = 'Administrator';
    this.nuxeoApi.loginWithToken(token).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
