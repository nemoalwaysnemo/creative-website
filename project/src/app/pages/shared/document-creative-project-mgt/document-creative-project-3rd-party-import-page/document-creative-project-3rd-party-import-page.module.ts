import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentCreativeProjectNavigationModule } from '../shared';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog';
import { DocumentFormModule } from '../../document-form/document-form.module';
import { DocumentViewerModule } from '../../document-viewer/document-viewer.module';
import { DocumentShareButtonModule } from '../../document-share-button/document-share-button.module';
import { DocumentCreativeProject3rdPartyImportComponent } from './document-creative-project-3rd-party-import-page.component';
import { DocumentNewPosterButtonModule } from '../../document-new-poster-button/document-new-poster-button.module';
import { DocumentCreativeProject3rdImportRequestComponent } from './document-creative-project-3rd-party-import-request-page/document-creative-project-3rd-party-import-request-page.component';
import { CreativeBrandProject3rdPartyImportComponent } from './document-creative-project-3rd-party-import-view-page/document-creative-project-3rd-party-import-asset-page.component';
import { DocumentCreativeProjectImportNewRequestComponent } from './document-creative-project-3rd-party-import-new-request/document-creative-project-import-new-request.component';
import { DocumentCreativeProject3rdPartyImportReviewComponent } from './document-creative-project-3rd-party-import-review-page/document-creative-project-3rd-party-import-review-page.component';
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
    DocumentCreativeProject3rdPartyImportComponent,
    DocumentCreativeProject3rdImportRequestComponent,
    CreativeBrandProject3rdPartyImportComponent,
    DocumentCreativeProjectImportNewRequestComponent,
    DocumentCreativeProject3rdPartyImportReviewComponent,
  ],
})
export class DocumentCreativeProject3rdPartyImportAssetModule {
}
