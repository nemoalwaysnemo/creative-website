import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog';
import { DocumentFormModule } from '../../document-form/document-form.module';
import { DocumentViewerModule } from '../../document-viewer/document-viewer.module';
import { DocumentShareButtonModule } from '../../document-share-button/document-share-button.module';
import { DocumentCreativeCampaignProjectsListPageComponent } from './document-creative-campaign-projects-list-page.component';
import { DocumentCreativeCampaignNavigationModule } from '../shared/document-creative-campaign-navigation/document-creative-campaign-navigation.module';
import { DocumentCreativeCampaignInfoModule } from '../shared/document-creative-campaign-info/document-creative-campaign-info.module';
import { DocumentCreativeCampaignProjectsListHomeComponent, DocumentCreativeCampaignProjectsListRowRenderComponent } from './document-creative-campaign-projects-list-home/document-creative-campaign-projects-list-home.component';
import { DocumentCreativeCampaignAssetHomeMenuComponent } from './document-creative-campaign-projects-list-home/document-creative-campaign-asset-home-action/document-creative-compaign-asset-home-menu.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentFormModule,
    DocumentViewerModule,
    DocumentShareButtonModule,
    ListSearchFormInDialogModule,
    DocumentCreativeCampaignNavigationModule,
    DocumentCreativeCampaignInfoModule,
  ],
  declarations: [
    DocumentCreativeCampaignProjectsListPageComponent,
    DocumentCreativeCampaignProjectsListHomeComponent,
    DocumentCreativeCampaignProjectsListRowRenderComponent,
    DocumentCreativeCampaignAssetHomeMenuComponent,
  ],
})
export class DocumentCreativeCampaignProjectsListPageModule { }
