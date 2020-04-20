import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { NbDialogModule } from '@core/nebular/theme';
import { DocumentFormDialogComponent } from './document-form-dialog/document-form-dialog.component';

const COMPONENTS = [
  DocumentFormDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NbDialogModule.forChild(),
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class GlobalDocumentDialogModule {

}
