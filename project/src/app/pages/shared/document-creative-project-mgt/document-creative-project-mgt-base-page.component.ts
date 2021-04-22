import { Component, Input, OnInit, OnDestroy, ComponentRef, ViewChild, ViewContainerRef, Type, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Subscription } from 'rxjs';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { CreativeProjectMgtSettings } from './document-creative-project-mgt.interface';

@Component({
  template: '',
})
export class DocumentCreativeProjectMgtBasePageComponent implements OnInit, OnDestroy {

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  @Input()
  set documentModel(doc: DocumentModel) {
    if (doc) {
      this.document = doc;
    }
  }

  document: DocumentModel;

  currentUser: UserModel;

  templateSettings: CreativeProjectMgtSettings = new CreativeProjectMgtSettings();

  protected dynamicComponentRef: ComponentRef<any>;

  protected subscription: Subscription = new Subscription();

  protected readonly eventType: string = 'CreativeCampaignProjectMgt';

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    this.subscribeEvents();
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  protected onInit(): void {

  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
    this.clearDynamicComponent();
  }

  protected changeView(component: Type<any>, settings: any = {}): void {
    if (component) {
      this.clearDynamicComponent();
      this.buildComponent(this.dynamicTarget, component, settings);
    }
  }

  protected clearDynamicComponent(): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
      this.dynamicComponentRef = null;
    }
  }

  protected createDynamicComponent(dynamicTarget: ViewContainerRef, component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return dynamicTarget.createComponent(componentFactory);
  }

  protected buildComponent(dynamicTarget: ViewContainerRef, component: Type<any>, settings: any = {}): void {
    this.dynamicComponentRef = this.createDynamicComponent(dynamicTarget, component);
    this.dynamicComponentRef.instance.documentModel = this.document;
    this.dynamicComponentRef.instance.settings = settings;
  }

  protected subscribeEvents(): void {
    this.documentPageService.onEventType(this.eventType).subscribe((event: GlobalEvent) => {
      this.onViewChanged(event);
    });
  }

  protected onViewChanged(event: GlobalEvent): void {

  }

}
