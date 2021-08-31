import { Component, ComponentFactoryResolver, Type, Input, ComponentRef, ViewContainerRef, ViewChild } from '@angular/core';
import { GoogleAnalyticsService } from '@core/services/google-analytics.service';
import { DocumentModel } from '@core/api';
import { DocumentDialogCustomComponent } from './document-dialog-custom/document-dialog-custom.component';
import { DocumentDialogFormComponent } from './document-dialog-form/document-dialog-form.component';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { DocumentDialogContainerComponent } from './document-dialog-container.component';
import { GlobalDocumentDialogSettings } from './global-document-dialog.interface';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  selector: 'global-document-dialog',
  styleUrls: ['./global-document-dialog.component.scss'],
  templateUrl: './global-document-dialog.component.html',
})
export class GlobalDocumentDialogComponent extends DocumentDialogContainerComponent {

  dialogContainerLayout: string = 'global-document-dialog-container';

  @Input()
  set settings(settings: GlobalDocumentDialogSettings) {
    if (settings) {
      this.components = settings.components;
      this.dialogSettings = Object.assign({}, this.dialogSettings, settings.metadata);
      this.mainComponent = settings.main || settings.components[0];
      this.dialogContainerLayout = settings.containerLayout;
    }
  }

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  protected components: Type<any>[] = [];

  protected mainComponent: any;

  protected dynamicComponent: ComponentRef<any>;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected googleAnalyticsService: GoogleAnalyticsService,
  ) {
    super(globalDocumentDialogService, documentPageService, componentFactoryResolver);
    this.subscribeDialogEvents();
  }

  selectView(name: string, component?: Type<any>, metadata?: any): void {
    this.destroyDynamicComponent();
    component = component || this.getComponentByName(name);
    this.createComponent(component, (metadata || {}).document || this.document, metadata);
  }

  protected onInit(): void {

  }

  protected subscribeDialogEvents(): void {
    this.subscribeGlobalDialogEvents();
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

  protected createComponent(component: any, document: DocumentModel, metadata: any = {}): void {
    const type: string = component.COMPONENT_TYPE;
    switch (type) {
      case 'form':
        this.createFormComponent(component, document, metadata);
        break;
      case 'custom':
        this.createCustomComponent(component, document, metadata);
        break;
      default:
        throw new Error(`Unknown Dialog view type: ${type}`);
    }
  }

  protected createFormComponent(component: Type<any>, document: DocumentModel, metadata: any = {}): void {
    this.buildComponent(DocumentDialogFormComponent, component, document, metadata);
  }

  protected createCustomComponent(component: Type<any>, document: DocumentModel, metadata: any = {}): void {
    this.buildComponent(DocumentDialogCustomComponent, component, document, metadata);
  }

  protected buildComponent(container: Type<any>, component: Type<any>, document: DocumentModel, metadata: any = {}): void {
    this.dynamicComponent = this.createDynamicComponent(this.dynamicTarget, container);
    this.dynamicComponent.instance.title = metadata.title || this.title;
    this.dynamicComponent.instance.metadata = Object.assign({}, this.dialogSettings, metadata);
    this.dynamicComponent.instance.documentModel = document;
    this.dynamicComponent.instance.documents = metadata.documents || this.documentList;
    this.dynamicComponent.instance.redirectUrl = metadata.redirectUrl || this.redirectUrl;
    this.dynamicComponent.instance.mainViewChanged = this.mainViewChanged;
    this.dynamicComponent.instance.component = component;
  }

  protected subscribeGlobalDialogEvents(): void {
    const subscription = this.globalDocumentDialogService.onEventType('built-in').subscribe((e: DocumentDialogEvent) => {
      const options = e.options || {};
      if (e.name === 'ComponentChanged') {
        const metadata = options.metadata || {};
        const main = this.mainComponent.NAME;
        const name = options.componentName || main;
        const component = name === main ? this.mainComponent : options.component;
        this.mainViewChanged.changed = metadata.mainViewChanged !== undefined ? metadata.mainViewChanged : main !== name || (metadata && metadata.document);
        this.selectView(name, component, metadata);
      }
    });
    this.subscription.add(subscription);
  }

  protected googleAnalyticsTrackEvent(type: string): void {
    let category = 'PopupPreview';
    if (type === 'form') {
      category = 'PopupForm';
    } else if (type === 'custom') {
      category = 'PopupCustom';
    }
    this.googleAnalyticsService.trackEvent({
      event_category: category,
      event_action: 'Dialog Open',
      event_label: `Dialog Open | ${this.document.title}`,
      'dimensions.docId': this.document.uid,
      'dimensions.docTitle': this.document.title,
      'dimensions.docType': this.document.type,
      'dimensions.userEvent': 'Dialog Open',
    });
  }

}
