import { Component, OnDestroy } from '@angular/core';
import { NuxeoApiService, DocumentRepository } from '@core/api';

@Component({
  selector: 'tbwa-list-page',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html',
})
export class ListComponent implements OnDestroy {

  private alive: boolean = true;

  constructor(private nuxeoApi: NuxeoApiService, private documentRepository: DocumentRepository) {
    const token = '5ee79339-b07c-408b-90cd-30484ef02688';
    // const username = 'Administrator';
    // const password = 'Administrator';
    this.nuxeoApi.loginWithToken(token).subscribe(response => {
      this.documentRepository.get('24f08e3f-02d9-49a0-b07a-a8672957c7f2').subscribe(res => {
        console.log(res);
      });
    }, error => {
      console.log(error);
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
