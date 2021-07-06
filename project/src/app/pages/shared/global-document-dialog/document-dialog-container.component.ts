import { Component, Input, Type, ComponentRef, ViewContainerRef, ViewChild, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentDialogBaseTemplateComponent } from './document-dialog-base-template.component';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';

@Component({
  template: '',
})
export class DocumentDialogContainerComponent extends DocumentDialogBaseTemplateComponent {

  @Input() component: Type<any>;

  @Input()
  set documents(docs: DocumentModel[]) {
    if (docs) {
      this.documentList = docs;
      if (this.dynamicComponent) {
        this.dynamicComponent.instance.documents = docs;
      }
    }
  }

  @Output() event$: EventEmitter<DocumentDialogEvent> = new EventEmitter<DocumentDialogEvent>();

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  protected documentList: DocumentModel[] = [];

  protected dynamicComponent: ComponentRef<any>;

  protected subscription: Subscription = new Subscription();

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected onInit(): void {
    this.createComponent(this.component, this.document, this.dialogSettings);
  }

  protected createDynamicComponent(dynamicTarget: ViewContainerRef, component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return dynamicTarget.createComponent(componentFactory);
  }

  protected createComponent(component: Type<any>, document: DocumentModel, metadata: any = {}): void {
    this.dynamicComponent = this.createDynamicComponent(this.dynamicTarget, component);
    this.dynamicComponent.instance.title = this.title;
    this.dynamicComponent.instance.metadata = metadata;
    this.dynamicComponent.instance.documentModel = document;
    this.dynamicComponent.instance.documents = this.documentList;
    this.dynamicComponent.instance.redirectUrl = this.redirectUrl;
    this.dynamicComponent.instance.mainViewChanged = this.mainViewChanged;
  }

  protected destroyDynamicComponent(): void {
    if (this.dynamicComponent) {
      this.dynamicComponent.destroy();
      this.dynamicComponent = null;
    }
  }

  protected onDestroy(): void {
    this.documentList = [];
    this.destroyDynamicComponent();
    this.subscription.unsubscribe();
  }

}
