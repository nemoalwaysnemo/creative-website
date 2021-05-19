import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentBulkImportComponent } from './document-bulk-import.component';
import { DocumentFormModule } from '../document-form/document-form.module';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
  ],
  declarations: [
    DocumentBulkImportComponent,
  ],
  exports: [
    DocumentBulkImportComponent,
  ],
})
export class DocumentBulkImportModule {
}
