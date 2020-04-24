import { OnInit, OnDestroy, Input, Type, ComponentRef, ViewContainerRef, ViewChild, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../../shared/services/search-query-params.service';
import { DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';
import { Environment } from '@environment/environment';

export abstract class AbstractDocumentDialogComponent implements OnInit, OnDestroy {

  @Input() document: DocumentModel;

  @Input() title: string = 'Global Dialog';

  @Input() component: Type<any>;

  @Output() event$: EventEmitter<DocumentDialogEvent> = new EventEmitter<DocumentDialogEvent>();

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  protected customComponent: ComponentRef<any>;

  protected subscription: Subscription = new Subscription();

  constructor(
    protected dialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected componentFactoryResolver: ComponentFactoryResolver,
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

  refresh(): void {
    this.queryParamsService.refresh();
  }

  selectView(name: string): void {
    this.event$.next({ name: 'viewChanged', message: 'View Changed', doc: this.document, options: { view: name } });
  }

  protected createCustomComponent(dynamicTarget: ViewContainerRef, component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return dynamicTarget.createComponent(componentFactory);
  }

  protected abstract createComponent(): void;

  protected onInit(): void {
    this.createComponent();
  }

  protected onDestroy(): void {
    if (this.customComponent) {
      this.customComponent.destroy();
    }
    this.subscription.unsubscribe();
  }

  protected onOpen(): void { }

  protected onClose(): void { }

  protected onDocumentChange(event: DocumentDialogEvent): void { }

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
