import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { ListSearchFormModule } from '../list-search-form';
import { DocumentCreativeProjectInfoComponent } from './document-creative-project-info/document-creative-project-info.component';
import { DocumentCreativeProjectRelatedAssetComponent } from './document-creative-project-related-asset/document-creative-project-related-asset.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ListSearchFormModule,
  ],
  declarations: [
    DocumentCreativeProjectInfoComponent,
    DocumentCreativeProjectRelatedAssetComponent,
  ],
  exports: [
    DocumentCreativeProjectInfoComponent,
    DocumentCreativeProjectRelatedAssetComponent,
  ],
})
export class DocumentCreativeProjectMgtModule {
}
