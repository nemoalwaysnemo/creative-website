import { OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { NavigationExtras } from '@angular/router';
import { DocumentModel } from '@core/api';
import { Subscription, timer } from 'rxjs';
import { Environment } from '@environment/environment';

export abstract class AbstractDocumentDialogBaseTemplateComponent implements OnInit, OnDestroy {

  document: DocumentModel;

  @Input()
  set metadata(metadata: any) {
    if (metadata) {
      this.settings = Object.assign({}, this.settings, metadata);
    }
  }

  @Input() redirectUrl: string;

  @Input() title: string = 'Global Dialog';

  @Input()
  set documentModel(doc: DocumentModel) {
    this.setDocument(doc);
  }

  @Output() callback: EventEmitter<DocumentDialogEvent> = new EventEmitter<DocumentDialogEvent>();

  protected subscription: Subscription = new Subscription();

  protected settings: any = {};

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

  getSettings(): any {
    return this.settings;
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
      this.queryParamsService.refresh();
    }
  }

  navigate(commands: any[], extras?: NavigationExtras): void {
    this.queryParamsService.navigate(commands, extras);
  }

  assetPath(src: string): string {
    return Environment.assetPath + src;
  }

  closeBtnImage(): string {
    return this.assetPath('assets/images/close1.png');
  }

  backBtnImage(): string {
    return this.assetPath('assets/images/back_icon_white.png');
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

  protected onOpen(): void { }

  protected onClose(): void { }

  protected onConfirmed(doc: DocumentModel): void { }

  protected onCancelled(): void { }

  protected onDocumentChange(event: DocumentDialogEvent): void { }

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
