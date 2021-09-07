import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentPageService, GlobalEvent } from '../../services/document-page.service';
import { DocumentCreativeCampaignMgtBasePageComponent } from '../document-creative-campaign-mgt-base-page.component';
import { DocumentCreativeCampaignAssetHomeComponent } from './document-creative-campaign-asset-home/document-creative-campaign-asset-home.component';
import { TAB_CONFIG } from './document-creative-campaign-mgt-asset-tab-config';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { CreativeCampaignMgtSettings } from '../document-creative-campaign-mgt.interface';
@Component({
  selector: 'document-creative-campaign-asset-page',
  styleUrls: ['../document-creative-campaign-mgt.component.scss', './document-creative-campaign-asset-page.component.scss'],
  templateUrl: './document-creative-campaign-asset-page.component.html',
})
export class DocumentCreativeCampaignAssetPageComponent extends DocumentCreativeCampaignMgtBasePageComponent {

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
    const component = this.templateSettings.homeView ? this.getAssetViewConfig(this.templateSettings.homeView).component : DocumentCreativeCampaignAssetHomeComponent;
    this.changeView(component);
  }

  protected onViewChanged(event: GlobalEvent): void {
    const data = this.getAssetViewConfig(event.data.view);
    if (data) {
      this.changeView(data.component, event.data.settings);
    }
  }

  protected performMainViewChangedSettings(settings: CreativeCampaignMgtSettings): void {
    if (settings.mainViewChanged && settings.documentType === 'asset') {
      delete settings.documentType;
      const project: any = this.document.getParent('project') || {};
      this.globalDocumentDialogService.mainViewChanged(settings.mainViewChanged, new CreativeCampaignMgtSettings({
        mainViewChanged: true,
        title: project.title,
        project,
        document: this.document,
        mainViewDocument: project,
        homeTemplate: 'creative-campaign-mgt-template',
        homePage: 'campaign-asset-page',
        homeView: 'campaign-asset-home-view',
      }));
    }
  }
  private getAssetViewConfig(name: string): any {
    return this.tabs.find((t: NbMenuItem) => t.id === name);
  }

}
