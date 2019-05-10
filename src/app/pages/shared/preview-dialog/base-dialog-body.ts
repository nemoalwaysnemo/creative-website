import { OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DocumentModel } from '@core/api';
import { PreviewDialogService } from './preview-dialog.service';
import { Subscription } from 'rxjs';
import { Environment } from '@environment/environment';

export abstract class BaseDialogBody implements OnInit, OnDestroy {

  document: DocumentModel;

  dialogLayout: string = 'dialogSlides';

  storyboard: boolean = false;

  @Output() callBack: EventEmitter<{ type: string, value: any }> = new EventEmitter<{ type: string, value: any }>();

  protected subscription: Subscription = new Subscription();

  constructor(protected dialogService: PreviewDialogService) { }

  ngOnInit() {
    this.onDocumentNext();
    this.dialogService.onClose().subscribe(_ => {
      this.onClose();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close(): void {
    this.dialogService.close();
  }

  closeBtnImage(): string {
    return this.assetPath('assets/images/close1.png');
  }

  previewBtnImage(): string {
    return this.assetPath('assets/images/preview_logo.png');
  }

  protected onClose(): void {}

  protected parseCountry(list: string[]): string {
    return list.map((x) => x.split('/').pop()).join(', ');
  }

  protected assetPath(src: string): string {
    return Environment.assetPath + src;
  }

  private onDocumentNext(): void {
    const subscription = this.dialogService.onDocumentNext().subscribe((res: { doc: DocumentModel, type: string, options: any }) => {
      this.document = res.doc;
      this.initDocument(res);
    });
    this.subscription.add(subscription);
  }

  protected abstract initDocument(res: any): void;

}
