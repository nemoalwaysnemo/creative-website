import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentBatchOperationComponent } from './document-batch-operation.component';
import { DocumentFormModule } from '../document-form/document-form.module';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
  ],
  declarations: [
    DocumentBatchOperationComponent,
  ],
  exports: [
    DocumentBatchOperationComponent,
  ],
})
export class DocumentBatchOperationModule {
}
