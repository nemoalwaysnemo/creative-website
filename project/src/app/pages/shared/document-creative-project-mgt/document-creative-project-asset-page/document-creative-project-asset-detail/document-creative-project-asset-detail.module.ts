import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentCreativeProjectAssetDetailComponent } from './document-creative-project-asset-detail.component';
import { DocumentCreativeProjectAssetDetailInfoModule } from '../document-creative-project-asset-detail-info/document-creative-project-asset-detail-info.module';
import { DocumentNewPosterButtonModule } from '../../../document-new-poster-button/document-new-poster-button.module';
import { DocumentViewerModule } from '../../../document-viewer/document-viewer.module';
import { DocumentShareButtonModule } from '../../../../shared/document-share-button/document-share-button.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentNewPosterButtonModule,
    DocumentViewerModule,
    DocumentShareButtonModule,
    DocumentCreativeProjectAssetDetailInfoModule,
  ],
  declarations: [
    DocumentCreativeProjectAssetDetailComponent,
  ],
})
export class DocumentCreativeProjectAssetDetailModule {
}
