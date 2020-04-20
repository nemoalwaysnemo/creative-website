import { OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../../shared/services/search-query-params.service';
import { DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';
import { Environment } from '@environment/environment';

export abstract class AbstractDocumentDialogComponent implements OnInit, OnDestroy {

  @Input() document: DocumentModel;

  @Input() title: string = 'Global Dialog';

  @Output() callBack: EventEmitter<{ type: string, value: any }> = new EventEmitter<{ type: string, value: any }>();

  @Output() onCreated: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  protected subscription: Subscription = new Subscription();

  constructor(protected dialogService: GlobalDocumentDialogService, protected queryParamsService: SearchQueryParamsService) {
    this.onDocumentChanged();
    this.registerListeners();
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  protected onInit(): void {
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  close(): void {
    this.dialogService.close();
  }

  closeBtnImage(): string {
    return this.assetPath('assets/images/close1.png');
  }

  backBtnImage(): string {
    return this.assetPath('assets/images/back_icon_white.png');
  }

  previewBtnImage(): string {
    return this.assetPath('assets/images/preview_logo.png');
  }

  public refresh(): void {
    this.queryParamsService.refresh();
  }

  protected onOpen(): void { }

  protected onClose(): void { }

  protected onDocumentChange(data: any): void { }

  protected assetPath(src: string): string {
    return Environment.assetPath + src;
  }

  private onDocumentChanged(): void {
    const subscription = this.dialogService.onDocumentChanged().subscribe((e: DocumentDialogEvent) => {
      this.document = e.doc;
      this.onDocumentChange(e);
    });
    this.subscription.add(subscription);
  }

  private registerListeners(): void {
    this.dialogService.onOpen().subscribe(_ => { this.onOpen(); });
    this.dialogService.onClose().subscribe(_ => { this.onClose(); });
  }
}
