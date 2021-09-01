import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentPageService, GlobalEvent } from '../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { DocumentCreativeProjectMgtBasePageComponent } from '../document-creative-project-mgt-base-page.component';
import { DocumentCreativeProjectAssetHomeComponent } from './document-creative-project-asset-home/document-creative-project-asset-home.component';
import { CreativeProjectMgtSettings } from '../document-creative-project-mgt.interface';
import { TAB_CONFIG } from './document-creative-project-mgt-asset-tab-config';

@Component({
  selector: 'document-creative-project-asset-page',
  styleUrls: ['../document-creative-project-mgt.component.scss', './document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-asset-page.component.html',
})
export class DocumentCreativeProjectAssetPageComponent extends DocumentCreativeProjectMgtBasePageComponent {

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
    const component = this.templateSettings.homeView ? this.getAssetViewConfig(this.templateSettings.homeView).component : DocumentCreativeProjectAssetHomeComponent;
    this.changeView(component, this.templateSettings);
  }

  protected onViewChanged(event: GlobalEvent): void {
    const data = this.getAssetViewConfig(event.data.view);
    if (data) {
      this.changeView(data.component, event.data.settings);
    }
  }

  protected performMainViewChangedSettings(settings: CreativeProjectMgtSettings): void {
    if (settings.mainViewChanged && settings.documentType === 'asset') {
      delete settings.documentType;
      const project: any = this.document.getParent('project') || {};
      this.globalDocumentDialogService.mainViewChanged(settings.mainViewChanged, new CreativeProjectMgtSettings({
        mainViewChanged: true,
        title: project.title,
        project,
        document: this.document,
        mainViewDocument: project,
        homeTemplate: 'creative-project-mgt-template',
        homePage: 'asset-page',
        homeView: 'asset-home-view',
      }));
    }
  }

  private getAssetViewConfig(name: string): any {
    return this.tabs.find((t: NbMenuItem) => t.id === name);
  }

}
