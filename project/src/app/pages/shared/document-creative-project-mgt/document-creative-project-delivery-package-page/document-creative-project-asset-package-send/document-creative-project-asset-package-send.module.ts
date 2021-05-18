import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentCreativeProjectAssetPackageSendComponent } from './document-creative-project-asset-package-send.component';
import { DocumentCreativeProjectRelatedAssetModule } from '../../shared/document-creative-project-related-asset/document-creative-project-related-asset.module';
import { DocumentFormModule } from '../../../../shared/document-form/document-form.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentFormModule,
    DocumentCreativeProjectRelatedAssetModule,
  ],
  declarations: [
    DocumentCreativeProjectAssetPackageSendComponent,
  ],
})
export class DocumentCreativeProjectAssetPackageSendModule {
}
