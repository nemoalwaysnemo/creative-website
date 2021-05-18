import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCreativeProjectRelatedAssetComponent } from './document-creative-project-related-asset.component';
import { ListSearchFormInDialogModule } from '../../../../shared/list-search-form-in-dialog/list-search-form-in-dialog.module';
import { DocumentListViewModule } from '../../../../shared/document-list-view/document-list-view.module';

@NgModule({
  imports: [
    CommonModule,
    ListSearchFormInDialogModule,
    DocumentListViewModule,
  ],
  declarations: [
    DocumentCreativeProjectRelatedAssetComponent,
  ],
  exports: [
    DocumentCreativeProjectRelatedAssetComponent,
  ],
})
export class DocumentCreativeProjectRelatedAssetModule {
}
