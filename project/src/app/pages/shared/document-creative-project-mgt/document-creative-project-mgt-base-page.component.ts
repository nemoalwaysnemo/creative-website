import { Component, Input, OnInit, OnDestroy, ComponentRef, ViewChild, ViewContainerRef, Type, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, GlobalSearchParams, NuxeoPagination, UserModel } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { Observable, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { CreativeProjectMgtSettings } from './document-creative-project-mgt.interface';

@Component({
  template: '',
})
export class DocumentCreativeProjectMgtBasePageComponent implements OnInit, OnDestroy {

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  @Input()
  set documentModel(doc: DocumentModel) {
    this.setInputDocument(doc);
  }

  @Input()
  set settings(settings: any) {
    if (!isValueEmpty(settings)) {
      this.templateSettings = settings;
    }
  }

  document: DocumentModel;

  currentUser: UserModel;

  templateSettings: CreativeProjectMgtSettings = new CreativeProjectMgtSettings();

  protected dynamicComponentRef: ComponentRef<any>;

  protected subscription: Subscription = new Subscription();

  protected readonly eventType: string = 'creative-campaign-project-mgt';

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService) {
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  protected onInit(): void {

  }

  protected setInputDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
    }
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
    this.clearDynamicComponent();
  }

  protected changeView(component: Type<any>, settings: any = {}): void {
    if (component) {
      this.clearDynamicComponent();
      timer(0).subscribe(() => { this.performMainViewChangedSettings(settings); });
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
    this.dynamicComponentRef.instance.documentModel = settings.document || this.document;
    this.dynamicComponentRef.instance.settings = settings;
  }

  protected performMainViewChangedSettings(settings: CreativeProjectMgtSettings): void {

  }

  protected subscribeEvents(): void {
    const subscription = this.documentPageService.onEventType(this.eventType).subscribe((event: GlobalEvent) => {
      if (event.name === 'SelectedComponentChanged') {
        if (event.data.type === 'page') {
          this.onPageChanged(event);
          this.globalDocumentDialogService.mainViewChanged(false);
        } else if (event.data.type === 'view') {
          this.onViewChanged(event);
          const settings = event.data.settings;
          this.globalDocumentDialogService.mainViewChanged(settings.mainViewChanged, settings);
        } else if (event.data.type === 'dialog') {
          this.globalDocumentDialogService.selectView(event.data.view, null, event.data.settings || {});
        }
      }
    });
    this.subscription.add(subscription);
  }

  protected search(params: any = {}): Observable<DocumentModel[]> {
    return this.documentPageService.advanceRequest(new GlobalSearchParams(params)).pipe(
      map((res: NuxeoPagination) => res.entries),
    );
  }

  protected triggerChangeView(view: string, type: string, settings: CreativeProjectMgtSettings = {}): void {
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedComponentChanged', data: { view, type, settings, component: settings.component }, type: this.eventType }));
  }

  protected onPageChanged(event: GlobalEvent): void {

  }

  protected onViewChanged(event: GlobalEvent): void {

  }

}
