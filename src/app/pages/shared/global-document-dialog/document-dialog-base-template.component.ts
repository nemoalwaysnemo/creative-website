import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Type } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { DocumentModel } from '@core/api';
import { map } from 'rxjs/operators';
import { Subscription, timer, Subject, zip, forkJoin, of as observableOf, Observable } from 'rxjs';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { Environment } from '@environment/environment';

@Component({
  template: '',
})
export class DocumentDialogBaseTemplateComponent implements OnInit, OnDestroy {

  document: DocumentModel;

  mainViewChanged = false;

  callbackEvent: DocumentDialogEvent;

  @Input() redirectUrl: string;

  @Input() title: string = 'Global Dialog';

  @Input()
  set documentModel(doc: DocumentModel) {
    this.setDocument(doc);
  }

  @Input()
  set metadata(metadata: any) {
    if (metadata) {
      this.dialogSettings = Object.assign({}, this.dialogSettings, metadata);
    }
  }

  @Output() callback: EventEmitter<DocumentDialogEvent> = new EventEmitter<DocumentDialogEvent>();

  protected subscription: Subscription = new Subscription();

  private lifeCycle$ = new Subject<string>();

  protected dialogSettings: any = {};

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    this.registerListeners();
  }

  ngOnInit(): void {
    this.onInit();
    this.lifeCycle$.next('onInit');
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  getDialogSettings(): any {
    return this.dialogSettings;
  }

  selectView(name: string, component: Type<any> = null, metadata: any = {}): void {
    this.globalDocumentDialogService.selectView(name, component, metadata);
  }

  backToMainView(): void {
    this.globalDocumentDialogService.selectView(null);
  }

  confirm(refresh: boolean = true, delay: number = 0): void {
    this.onConfirmed(this.document);
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

  refresh(redirectUrl?: string): void {
    if (redirectUrl || this.redirectUrl) {
      this.queryParamsService.redirect(redirectUrl || this.redirectUrl);
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

  protected getDocumentPermission(doc: DocumentModel, name: string, extras: boolean): Observable<boolean> {
    return forkJoin(
      doc.hasPermission(name),
      observableOf(extras),
    ).pipe(map((l: boolean[]) => l[0] && l[1]));
  }

  protected onOpen(e: DocumentDialogEvent): void {
  }

  protected onClose(e: DocumentDialogEvent): void {
    this.callbackEvent = null;
  }

  protected onConfirmed(doc: DocumentModel): void { }

  protected onCancelled(): void { }

  private registerListeners(): void {
    const a = zip(
      this.globalDocumentDialogService.onOpen(),
      this.lifeCycle$,
    ).pipe(map(_ => _.shift())).subscribe((e: DocumentDialogEvent) => { this.onOpen(e); });
    const b = this.globalDocumentDialogService.onClose().subscribe((e: DocumentDialogEvent) => { this.onClose(e); });
    const c = this.globalDocumentDialogService.onEventType('callback').subscribe((e: DocumentDialogEvent) => { this.callbackEvent = e; });
    this.subscription.add(a);
    this.subscription.add(b);
    this.subscription.add(c);
  }

}