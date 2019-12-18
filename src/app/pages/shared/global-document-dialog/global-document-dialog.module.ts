import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { NbDialogModule } from '@core/nebular/theme';
import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { DocumentFormDialogComponent } from './document-form-dialog/document-form-dialog.component';
import { GLOBAL_DOCUMENT_FORMS } from '../global-document-form';

const COMPONENTS = [
  DocumentFormDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NbDialogModule.forRoot(),
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...GLOBAL_DOCUMENT_FORMS(),
  ],
})
export class GlobalDocumentDialogModule {

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: GlobalDocumentDialogModule,
      providers: [
        GlobalDocumentDialogService,
        ...NbDialogModule.forRoot().providers,
      ],
    };
  }
}
