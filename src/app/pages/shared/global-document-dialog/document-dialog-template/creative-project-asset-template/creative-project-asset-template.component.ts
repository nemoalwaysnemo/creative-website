import { Component, ViewChild, ViewContainerRef, Type, ComponentFactoryResolver, ComponentRef, OnInit, OnDestroy } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { parseTabRoute } from '@core/services/helpers';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService, DocumentDialogEvent } from '../../global-document-dialog.service';
import { TAB_CONFIG } from './creative-project-asset-template-tab-config';
import { GLOBAL_DOCUMENT_FORM } from '../../../global-document-form';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'creative-project-asset-template',
  styleUrls: ['../global-document-dialog-template.scss', './creative-project-asset-template.component.scss'],
  templateUrl: './creative-project-asset-template.component.html',
})
export class CreativeProjectAssetTemplateComponent extends DocumentDialogCustomTemplateComponent {

  static readonly NAME: string = 'creative-project-asset-template';

  writePermission$: Observable<boolean> = observableOf(false);

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  dialogMetadata: any = {
    formMode: 'edit',
  };

  protected dynamicComponentRef: ComponentRef<any>;

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  onInit() {
    super.onInit();
    this.subscribeEvents();
  }

  getDialogFormTemplateName(doc: DocumentModel): string {
    let name: string = '';
    if (doc.type === 'App-Library-Project') {
      name = GLOBAL_DOCUMENT_FORM.CREATIVE_PROJECT_FORM.NAME;
    }
    return name;
  }

  onMenuClick(item: NbMenuItem): void {
    this.changeView(item.component);
  }

  private subscribeEvents(): void {
    const subscription = this.globalDocumentDialogService.onEventType('custom').pipe(
      // filter((params: any) => this.document.uid === params.uid),
    ).subscribe((event: DocumentDialogEvent) => {
      // console.log(66666, event);
    });
    this.subscription.add(subscription);
  }

  protected onOpen(): void {
    const params = this.globalDocumentDialogService.getParams();
    const index = !!params ? params.page : 0;
    // console.log(this.tabs);
    this.tabs[1].selected = true;
    this.changeView(this.tabs[1].component);
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
    this.clearDynamicComponent();
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
      const brand = doc.filterParents(['App-Library-Folder']).pop();
      if (brand) {
        doc.setParent(brand, 'brand');
      }
      const campaignMgt = doc.filterParents(['App-Library-Campaign-Mgt-Folder']).pop();
      if (campaignMgt) {
        doc.setParent(campaignMgt, 'parent');
      }
      this.document = doc;
    }
  }

  private changeView(component: Type<any>): void {
    if (component) {
      this.clearDynamicComponent();
      this.buildComponent(this.dynamicTarget, component);
    }
  }

  private clearDynamicComponent(): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
      this.dynamicComponentRef = null;
    }
  }

  private createDynamicComponent(dynamicTarget: ViewContainerRef, component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return dynamicTarget.createComponent(componentFactory);
  }

  protected buildComponent(dynamicTarget: ViewContainerRef, component: Type<any>): void {
    this.dynamicComponentRef = this.createDynamicComponent(dynamicTarget, component);
    this.dynamicComponentRef.instance.documentModel = this.document;
  }

}
