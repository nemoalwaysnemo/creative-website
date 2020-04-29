import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbPopoverModule } from '@core/nebular/theme';
import { DocumentActionGroupComponent } from './document-action-group.component';
import { ShareDocumentButtonModule } from '../share-document-button/share-document-button.module';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    NbPopoverModule,
    ShareDocumentButtonModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    DocumentActionGroupComponent,
  ],
  exports: [
    DocumentActionGroupComponent,
  ],
})
export class DocumentActionGroupModule {
}
