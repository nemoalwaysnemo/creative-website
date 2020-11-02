import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentModel, UserModel } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  template: '',
})
export class BaseDocumentViewComponent implements OnInit, OnDestroy {

  protected subscription: Subscription = new Subscription();

  constructor(protected documentPageService: DocumentPageService) {
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  onInit(): void {

  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected setCurrentDocument(doc?: DocumentModel, user?: UserModel): void {
    this.documentPageService.setCurrentDocument(doc);
  }

}
