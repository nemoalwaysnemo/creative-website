import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentPageService, GlobalEvent } from '../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { DocumentCreativeProjectMgtBasePageComponent } from '../document-creative-project-mgt-base-page.component';
import { DocumentCreativeProjectImportAssetHomeComponent } from './document-creative-project-import-asset-home/document-creative-project-import-asset-home.component';
import { TAB_CONFIG } from './document-creative-project-mgt-asset-tab-config';

@Component({
  selector: 'document-creative-project-import-asset',
  styleUrls: ['../document-creative-project-mgt.component.scss', './document-creative-project-import-asset.component.scss'],
  templateUrl: './document-creative-project-import-asset.component.html',
})
export class DocumentCreativeProjectImportAssetComponent extends DocumentCreativeProjectMgtBasePageComponent {

  tabs: NbMenuItem[] = TAB_CONFIG;

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
  }

  protected onInit(): void {
    const component = this.templateSettings.homeView ? this.getAssetViewConfig(this.templateSettings.homeView).component : DocumentCreativeProjectImportAssetHomeComponent;
    this.changeView(component);
  }

  protected onViewChanged(event: GlobalEvent): void {
    const data = this.getAssetViewConfig(event.data.view);
    if (data) {
      this.changeView(data.component, event.data.settings);
    }
  }

  private getAssetViewConfig(name: string): any {
    return this.tabs.find((t: NbMenuItem) => t.id === name);
  }

}
