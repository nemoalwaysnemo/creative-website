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
      this.dialogSettings = Object.assign({}, this.dialogSettings, settings.metadata);
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

  selectView(name: string, component?: Type<any>, metadata?: any): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
      this.dynamicComponentRef = null;
    }
    component = component || this.getComponentByName(name);
    this.createComponent(component, metadata);
  }

  protected onInit(): void {

  }

  protected onInitialized(e: DocumentDialogEvent): void {
    const componentName = e.options.componentName;
    const component = e.options.component || this.mainComponent;
    this.globalDocumentDialogService.triggerEvent({ name: 'ViewOpened', type: 'built-in', messageContent: 'View Opened', options: { componentName, component } });
    this.googleAnalyticsTrackEvent(component.COMPONENT_TYPE);
    this.selectView(componentName, component, e.options);
  }

  protected getComponentByName(name: string): Type<any> {
    return this.components.filter((x: any) => x.NAME === name).shift();
  }

  protected createComponent(component: any, metadata?: any): void {
    const type: string = component.COMPONENT_TYPE;
    switch (type) {
      case 'form':
        this.createFormComponent(component, metadata);
        break;
      case 'custom':
        this.createCustomComponent(component, metadata);
        break;
      default:
        throw new Error(`Unknown Dialog view type: ${type}`);
    }
  }

  protected createFormComponent(component: Type<any>, metadata?: any): void {
    this.buildComponent(DocumentDialogFormComponent, component, metadata);
  }

  protected createCustomComponent(component: Type<any>, metadata?: any): void {
    this.buildComponent(DocumentDialogCustomComponent, component, metadata);
  }

  protected buildComponent(componentContainer: Type<any>, component: Type<any>, metadata?: any): void {
    this.dynamicComponentRef = this.createDynamicComponent(this.dynamicTarget, componentContainer);
    this.dynamicComponentRef.instance.title = this.title;
    this.dynamicComponentRef.instance.metadata = metadata || this.dialogSettings;
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
      this.selectView(name, component, e.options.metadata);
    });
  }

  protected googleAnalyticsTrackEvent(type: string): void {
    let category = 'PopupPreview';
    if (type === 'form') {
      category = 'PopupForm';
    } else if (type === 'custom') {
      category = 'PopupCustom';
    }
    this.googleAnalyticsService.trackEvent({
      'event_category': category,
      'event_action': 'Dialog Open',
      'event_label': `Dialog Open | ${this.document.title}`,
      'event_value': this.document.uid,
      'dimensions.docId': this.document.uid,
      'dimensions.docTitle': this.document.title,
    });
  }

}
