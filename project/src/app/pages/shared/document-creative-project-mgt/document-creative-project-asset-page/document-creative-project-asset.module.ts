import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog';
import { DocumentFormModule } from '../../document-form/document-form.module';
import { DocumentListViewModule } from '../../document-list-view/document-list-view.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentFormModule,
    DocumentListViewModule,
    ListSearchFormInDialogModule,
  ],
  declarations: [
    DocumentCreativeProjectHomeComponent,
  ],
})
export class DocumentCreativeProjectMgtModule {
}
