import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DocumentFormModule } from '../document-form/document-form.module';
import { GLOBAL_DOCUMENT_FORMS } from './global-document-form-mapping';

const COMPONENTS = [
  ...GLOBAL_DOCUMENT_FORMS(),
];

@NgModule({
  imports: [
    ThemeModule,
    DocumentFormModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class GlobalDocumentFormModule { }
