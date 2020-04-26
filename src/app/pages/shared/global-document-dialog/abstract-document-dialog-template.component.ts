import { OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { NavigationExtras } from '@angular/router';
import { DocumentModel } from '@core/api';
import { Subscription, timer } from 'rxjs';
import { Environment } from '@environment/environment';

export abstract class AbstractDocumentDialogTemplateComponent implements OnInit, OnDestroy {

  @Input() redirectUrl: string;

  @Input() document: DocumentModel;

  @Input() title: string = 'Global Dialog';

  @Output() callback: EventEmitter<DocumentDialogEvent> = new EventEmitter<DocumentDialogEvent>();

  protected subscription: Subscription = new Subscription();

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    this.onDocumentChanged();
    this.registerListeners();
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  confirm(doc: DocumentModel, refresh: boolean = true, delay: number = 0): void {
    this.onConfirmed(doc);
    this.close(delay);
    if (refresh) {
      this.refresh();
    }
  }

  cancel(delay: number = 0): void {
    this.close(delay);
    // this.dialogService.triggerEvent({ name: 'cancelled', message: 'Cancelled' });
  }

  close(delay: number = 0): void {
    timer(delay).subscribe(_ => {
      this.globalDocumentDialogService.close();
    });
  }

  refresh(): void {
    if (this.redirectUrl) {
      this.navigate([this.redirectUrl]);
    } else {
      this.refresh();
    }
  }

  navigate(commands: any[], extras?: NavigationExtras): void {
    if (commands) {
      this.queryParamsService.navigate(commands, extras);
    } else {
      this.queryParamsService.refresh();
    }
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

  protected onInit(): void {
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected onOpen(): void { }

  protected onClose(): void { }

  protected onConfirmed(doc: DocumentModel): void { }

  protected onCancelled(): void { }

  protected onDocumentChange(event: DocumentDialogEvent): void { }

  protected assetPath(src: string): string {
    return Environment.assetPath + src;
  }

  private onDocumentChanged(): void {
    const subscription = this.globalDocumentDialogService.onDocumentChanged().subscribe((e: DocumentDialogEvent) => {
      this.document = e.doc;
      this.onDocumentChange(e);
    });
    this.subscription.add(subscription);
  }

  private registerListeners(): void {
    this.globalDocumentDialogService.onOpen().subscribe(_ => { this.onOpen(); });
    this.globalDocumentDialogService.onClose().subscribe(_ => { this.onClose(); });
  }

}
