import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { NbPopoverModule } from '@core/nebular/theme';
import { DocumentActionGroupComponent } from './document-action-group.component';
import { DocumentShareButtonModule } from '../document-share-button/document-share-button.module';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';
import { DocumentNewPosterButtonModule } from '../document-new-poster-button/document-new-poster-button.module';

@NgModule({
  imports: [
    NgPipesModule,
    CommonModule,
    NbPopoverModule,
    DocumentShareButtonModule,
    GlobalDocumentDialogModule,
    DocumentNewPosterButtonModule,
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
