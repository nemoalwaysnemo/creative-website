import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentCreativeProjectNavigationModule } from '../shared';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog';
import { DocumentFormModule } from '../../document-form/document-form.module';
import { DocumentListViewModule } from '../../document-list-view/document-list-view.module';
import { DocumentCreativeProjectAssetPageComponent } from './document-creative-project-asset-page.component';
import { DocumentCreativeProjectAssetHomeComponent } from './document-creative-project-asset-home/document-creative-project-asset-home.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentFormModule,
    DocumentListViewModule,
    ListSearchFormInDialogModule,
    DocumentCreativeProjectNavigationModule,
  ],
  declarations: [
    DocumentCreativeProjectAssetPageComponent,
    DocumentCreativeProjectAssetHomeComponent,
  ],
})
export class DocumentCreativeProjectAssetModule {
}
