import { Component, OnDestroy } from '@angular/core';
import { NuxeoApiService } from '@core/api';

@Component({
  selector: 'tbwa-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnDestroy {

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

  nuxeoLogin() {

  }
}
