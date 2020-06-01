import { Component, ComponentFactoryResolver, Type, Input, ComponentRef, ViewContainerRef, ViewChild } from '@angular/core';
import { GoogleAnalyticsService } from '@core/services/google-analytics.service';
import { DocumentDialogContainerComponent } from './document-dialog-container.component';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentDialogFormComponent } from './document-dialog-form/document-dialog-form.component';
import { DocumentDialogCustomComponent } from './document-dialog-custom/document-dialog-custom.component';
import { GlobalDocumentDialogSettings } from './global-document-dialog.interface';

@Component({
  selector: 'global-document-dialog',
  styleUrls: ['./global-document-dialog.component.scss'],
  templateUrl: './global-document-dialog.component.html',
})
export class GlobalDocumentDialogComponent extends DocumentDialogContainerComponent {

  @Input()
  set settings(settings: GlobalDocumentDialogSettings) {
    if (settings) {
      this.components = settings.components;
      this.mainComponent = settings.main || settings.components[0];
    }
  }

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  protected components: Type<any>[] = [];

  protected mainComponent: any;

  protected dynamicComponentRef: ComponentRef<any>;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected googleAnalyticsService: GoogleAnalyticsService,
  ) {
    super(globalDocumentDialogService, documentPageService, componentFactoryResolver);
    this.subscribeEvents();
  }

  selectView(name: string, component?: Type<any>): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
    }
    component = component || this.getComponentByName(name);
    this.createComponent(component);
  }

  protected onInit(): void {

  }

  protected onOpen(e: DocumentDialogEvent): void {
    const componentName = e.options.componentName;
    const component = e.options.component || this.mainComponent;
    this.globalDocumentDialogService.triggerEvent({ name: 'ViewOpened', type: 'built-in', messageContent: 'View Opened', options: { componentName, component } });
    this.googleAnalyticsTrackEvent(component.COMPONENT_TYPE);
    this.selectView(componentName, component);
  }

  protected getComponentByName(name: string): Type<any> {
    return this.components.filter((x: any) => x.NAME === name).shift();
  }

  protected createComponent(component: any): void {
    const type: string = component.COMPONENT_TYPE;
    switch (type) {
      case 'form':
        this.createFormComponent(component);
        break;
      case 'custom':
        this.createCustomComponent(component);
        break;
      default:
        throw new Error(`Unknown Dialog view type: ${type}`);
    }
  }

  protected createFormComponent(component: Type<any>): void {
    this.buildComponent(DocumentDialogFormComponent, component);
  }

  protected createCustomComponent(component: Type<any>): void {
    this.buildComponent(DocumentDialogCustomComponent, component);
  }

  protected buildComponent(componentContainer: Type<any>, component: Type<any>): void {
    this.dynamicComponentRef = this.createDynamicComponent(this.dynamicTarget, componentContainer);
    this.dynamicComponentRef.instance.title = this.title;
    this.dynamicComponentRef.instance.metadata = this.dialogSettings;
    this.dynamicComponentRef.instance.documentModel = this.document;
    this.dynamicComponentRef.instance.redirectUrl = this.redirectUrl;
    this.dynamicComponentRef.instance.mainViewChanged = this.mainViewChanged;
    this.dynamicComponentRef.instance.component = component;
  }

  protected subscribeEvents(): void {
    this.subscription = this.globalDocumentDialogService.onEventName('ViewChanged').subscribe((e: DocumentDialogEvent) => {
      const main = this.mainComponent.NAME;
      const name = e.options.componentName || main;
      const component = name === main ? this.mainComponent : e.options.component;
      this.mainViewChanged = main !== name;
      this.selectView(name, component);
    });
  }

  protected googleAnalyticsTrackEvent(type: string): void {
    let category = 'PopupPreview';
    if (type === 'form') {
      category = 'PopupForm';
    } else if (type === 'custom') {
      category = 'PopupCustom';
    }
    this.googleAnalyticsService.trackEvent({ 'event_category': category, 'event_action': 'Dialog Open', 'event_label': 'Dialog Open', 'event_value': this.document.uid, 'dimensions.docId': this.document.uid });
  }

}
