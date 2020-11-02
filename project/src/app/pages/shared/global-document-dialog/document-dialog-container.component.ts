import { Component, Input, Type, ComponentRef, ViewContainerRef, ViewChild, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { DocumentDialogBaseTemplateComponent } from './document-dialog-base-template.component';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { DocumentPageService } from '../services/document-page.service';
import { Subscription } from 'rxjs';

@Component({
  template: '',
})
export class DocumentDialogContainerComponent extends DocumentDialogBaseTemplateComponent {

  @Input() component: Type<any>;

  @Output() event$: EventEmitter<DocumentDialogEvent> = new EventEmitter<DocumentDialogEvent>();

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

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
    this.createComponent(this.component);
  }

  protected createDynamicComponent(dynamicTarget: ViewContainerRef, component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return dynamicTarget.createComponent(componentFactory);
  }

  protected createComponent(component: Type<any>): void {
    if (!this.dynamicComponent) {
      this.dynamicComponent = this.createDynamicComponent(this.dynamicTarget, component);
    }
    this.dynamicComponent.instance.title = this.title;
    this.dynamicComponent.instance.metadata = this.dialogSettings;
    this.dynamicComponent.instance.documentModel = this.document;
    this.dynamicComponent.instance.redirectUrl = this.redirectUrl;
    this.dynamicComponent.instance.mainViewChanged = this.mainViewChanged;
  }

  protected onDestroy(): void {
    if (this.dynamicComponent) {
      this.dynamicComponent.destroy();
      this.dynamicComponent = null;
    }
    this.subscription.unsubscribe();
  }

}
