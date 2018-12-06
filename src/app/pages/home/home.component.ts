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
    const token = 'a636850d-1dbc-4d03-9e85-99fb7a7d36db';
    const username = 'Administrator';
    const password = 'Administrator';
    this.nuxeoApi.loginWithToken(token).subscribe(response => {
      console.log(response);
      // this.nuxeoApi.repository().schemas(['*']).fetch('/Creative').subscribe(res => {
      //   console.log(res);
      // });

      // this.nuxeoApi.operation('Creative.RetrieveReportMetaData').schemas(['*']).params({
      //   // 'entityType': 'acl',
      //   // 'entityType': 'asset',
      //   'entityType': 'contract',
      //   'currentPageIndex': 0,
      //   'pageSize': 10,
      // }).execute().subscribe(res => {
      //   console.log(res);
      // });

      const restAPI = 'backslash/pp/backslash_search/execute';
      const params = {
        currentPageIndex: 1,
        pageSize: 10,
        active_article: true,
        quickFilters: 'allEdgePages',
        void: true,
        the_loupe_main_prodcredits_production_date: '["thisMonth"]',
        tags_edges: '["Rise of the Machines"]',
        ecm_fulltext: 'dean',
        ecm_uuid: '["9af8a1cb-075e-4c93-89e3-9a85fa24d1d8"]',
        ecm_primaryType: '["App-Backslash-Video", "App-Backslash-Article"]',
      };
      this.nuxeoApi.request(restAPI)
        .queryParams(params)
        .schemas(['*'])
        .execute().subscribe(res => {
          console.log(res);
        });
    }, error => {
      console.log(error);
    });


    // this.nuxeoApi.login(username, password).subscribe(response => {
    //   console.log(response);
    // }, error => {
    //   console.log(error);
    // });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  nuxeoLogin() {

  }
}
