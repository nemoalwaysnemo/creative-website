import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentPageService, GlobalEvent } from '../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { DocumentCreativeProjectMgtBasePageComponent } from '../document-creative-project-mgt-base-page.component';
import { DocumentCreativeProjectUsageRightHomeComponent } from './document-creative-project-usage-rights-home/document-creative-project-usage-rights-home.component';
import { TAB_CONFIG } from './document-creative-project-usage-rights-tab-config';

@Component({
  selector: 'document-creative-project-usage-rights-page',
  styleUrls: ['./document-creative-project-usage-rights-page.component.scss'],
  templateUrl: './document-creative-project-usage-rights-page.component.html',
})
export class DocumentCreativeProjectUsageRightsComponent extends DocumentCreativeProjectMgtBasePageComponent {
  tabs: NbMenuItem[] = TAB_CONFIG;

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
    this.subscribeEvents();
  }

  protected onInit(): void {
    const component = this.templateSettings.homeView ? this.getAssetViewConfig(this.templateSettings.homeView).component : DocumentCreativeProjectUsageRightHomeComponent;
    this.changeView(component, this.templateSettings);
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
