import { Input, Type, ComponentRef, ViewContainerRef, ViewChild, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { AbstractDocumentDialogBaseTemplateComponent } from './abstract-document-dialog-base-template.component';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { Subscription } from 'rxjs';

export abstract class AbstractDocumentDialogContainerComponent extends AbstractDocumentDialogBaseTemplateComponent {

  @Input() component: Type<any>;

  @Output() event$: EventEmitter<DocumentDialogEvent> = new EventEmitter<DocumentDialogEvent>();

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  protected dynamicComponent: ComponentRef<any>;

  protected subscription: Subscription = new Subscription();

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

  protected onInit(): void {
    this.createComponent();
  }

  protected createDynamicComponent(dynamicTarget: ViewContainerRef, component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return dynamicTarget.createComponent(componentFactory);
  }

  protected createComponent(type?: string, component?: Type<any>): void {
    if (!this.dynamicComponent) {
      this.dynamicComponent = this.createDynamicComponent(this.dynamicTarget, this.component);
    }
    this.dynamicComponent.instance.title = this.title;
    this.dynamicComponent.instance.metadata = this.settings;
    this.dynamicComponent.instance.documentModel = this.document;
    this.dynamicComponent.instance.redirectUrl = this.redirectUrl;
    this.dynamicComponent.instance.mainViewChanged = this.mainViewChanged;
  }

  protected onDestroy(): void {
    if (this.dynamicComponent) {
      this.dynamicComponent.destroy();
    }
    this.subscription.unsubscribe();
  }

}
