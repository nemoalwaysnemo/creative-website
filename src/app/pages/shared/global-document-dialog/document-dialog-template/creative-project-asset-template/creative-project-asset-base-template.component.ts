import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';

@Component({
  template: '',
})
export class CreativeProjectAssetBaseTemplateComponent implements OnInit, OnDestroy {

  document: DocumentModel;

  @Input()
  set documentModel(doc: DocumentModel) {
    this.setDocument(doc);
  }

  protected subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  protected onInit(): void {

  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
    }
  }

}
