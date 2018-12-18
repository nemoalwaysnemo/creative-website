import { Component, OnDestroy, OnInit } from '@angular/core';
import { NuxeoApiService, DocumentRepository, DocumentModel } from '@core/api';
import { Router, ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'tbwa-detail-page',
  styleUrls: ['./detail.component.scss'],
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit, OnDestroy {

  product_id: string = '24f08e3f-02d9-49a0-b07a-a8672957c7f2';
  private alive: boolean = true;
  document: DocumentModel;

  constructor(
    private nuxeoApi: NuxeoApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private documentRepository: DocumentRepository) {
    const token = '5ee79339-b07c-408b-90cd-30484ef02688';
    // const username = 'Administrator';
    // const password = 'Administrator';
    this.nuxeoApi.loginWithToken(token).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {
    // this.checkParams();
    this.getDocument();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  nuxeoLogin() {

  }

  private getDocument() {
    this.documentRepository.get(this.product_id)
      .subscribe((res: DocumentModel) => {
        this.document = res;
      });
  }


  private checkParams(): void {
    this.activatedRoute.queryParams
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(queryParams => {
        if (!queryParams['id']) {
          this.router.navigate(['/404']);
        }
      });
  }
}
