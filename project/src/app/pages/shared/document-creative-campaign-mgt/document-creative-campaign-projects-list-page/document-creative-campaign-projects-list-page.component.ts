import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentPageService, GlobalEvent } from '../../services/document-page.service';
import { DocumentCreativeCampaignMgtBasePageComponent } from '../document-creative-campaign-mgt-base-page.component';
import { DocumentCreativeCampaignProjectsListHomeComponent } from './document-creative-campaign-projects-list-home/document-creative-campaign-projects-list-home.component';
import { TAB_CONFIG } from './document-creative-campaign-projects-list-tab-config';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';

@Component({
  selector: 'app-document-creative-campaign-projects-list-page',
  templateUrl: './document-creative-campaign-projects-list-page.component.html',
  styleUrls: ['./document-creative-campaign-projects-list-page.component.scss'],
})
export class DocumentCreativeCampaignProjectsListPageComponent extends DocumentCreativeCampaignMgtBasePageComponent {

  tabs: NbMenuItem[] = TAB_CONFIG;

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
  }

  protected onInit(): void {
    const component = this.templateSettings.homeView ? this.getAssetViewConfig(this.templateSettings.homeView).component : DocumentCreativeCampaignProjectsListHomeComponent;
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
