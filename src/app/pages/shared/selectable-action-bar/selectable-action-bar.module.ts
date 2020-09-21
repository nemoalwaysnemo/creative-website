
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbToastrModule, NbCheckboxModule } from '@core/nebular/theme';
import { SelectableActionBarComponent } from './selectable-action-bar.component';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    NbToastrModule,
    NbCheckboxModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    SelectableActionBarComponent,
  ],
  exports: [
    SelectableActionBarComponent,
  ],
})
export class SelectableActionBarModule { }
