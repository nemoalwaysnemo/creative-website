import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';

@Component({
  template: '',
})
export class DocumentPreviewInDialogBaseTemplateComponent implements OnInit, OnDestroy {

  document: DocumentModel;

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  @Input() title: string = 'Global Dialog';

  @Input()
  set documentModel(doc: DocumentModel) {
    this.setDocument(doc);
  }

  @Input()
  set metadata(metadata: any) {
    if (metadata) {
      this.dialogSettings = Object.assign({}, this.dialogSettings, this.getPreviewSettings(), metadata);
    }
  }

  @Output() callback: EventEmitter<any> = new EventEmitter<any>();

  protected dialogSettings: any = {
    docViewerLayout: 'dialogSlides',
  };

  protected subscription: Subscription = new Subscription();

  constructor(protected documentPageService: DocumentPageService) {
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  getDialogSettings(): any {
    return this.dialogSettings;
  }

  close(): void {
    this.callback.emit({ action: 'close' });
  }

  closeBtnImage(): string {
    return '/assets/images/close1.png';
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

  protected getPreviewSettings(): any {
    return {};
  }

}
