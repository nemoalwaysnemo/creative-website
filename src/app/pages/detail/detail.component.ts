import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentRepository, DocumentModel } from '@core/api';
import { Router, ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'tbwa-detail-page',
  styleUrls: ['./detail.component.scss'],
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit, OnDestroy {

  productId: string = 'ca275035-0d50-49f3-9e86-8d325bf5efea';
  private alive: boolean = true;
  document: DocumentModel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private documentRepository: DocumentRepository) {

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
    this.documentRepository.get(this.productId)
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
