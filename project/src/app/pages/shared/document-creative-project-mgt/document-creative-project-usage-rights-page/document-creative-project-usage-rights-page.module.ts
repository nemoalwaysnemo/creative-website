import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentFormModule } from '../../document-form/document-form.module';
import { DocumentViewerModule } from '../../document-viewer/document-viewer.module';
import { DocumentShareButtonModule } from '../../document-share-button/document-share-button.module';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog';
import { DocumentNewPosterButtonModule } from '../../document-new-poster-button/document-new-poster-button.module';
import { DocumentCreativeProjectNavigationModule } from '../shared';
import { DocumentCreativeProjectUsageRightsComponent } from './document-creative-project-usage-rights-page.component';
import { DocumentCreativeProjectUsageRightHomeComponent } from './document-creative-project-usage-rights-home/document-creative-project-usage-rights-home.component';
import { DocumentCreativeProjectUsageRightsListComponent, DocumentCreativeUsageRightsRowRenderComponent, DocumentCreativeUsageRightsLinkButtonComponent } from './document-creative-project-usage-rigths-list/document-creative-project-usage-rigths-list.component';
import { DocumentCreativeProjectAssetsListComponent, DocumentCreativeProjectAssetRowRenderComponent } from './document-creative-project-usage-rigths-list/document-creative-project-assets-list.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentFormModule,
    DocumentViewerModule,
    DocumentShareButtonModule,
    ListSearchFormInDialogModule,
    DocumentNewPosterButtonModule,
    DocumentCreativeProjectNavigationModule,
  ],
  declarations: [
    DocumentCreativeProjectUsageRightsComponent,
    DocumentCreativeUsageRightsRowRenderComponent,
    DocumentCreativeProjectUsageRightHomeComponent,
    DocumentCreativeProjectUsageRightsListComponent,
    DocumentCreativeUsageRightsLinkButtonComponent,
    DocumentCreativeProjectAssetsListComponent,
    DocumentCreativeProjectAssetRowRenderComponent,
  ],
})
export class DocumentCreativeProjectUsageRightsModule {
}
