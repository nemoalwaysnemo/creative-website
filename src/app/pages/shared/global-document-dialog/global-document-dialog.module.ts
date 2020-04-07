import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { NbDialogModule } from '@core/nebular/theme';
import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { DocumentFormDialogComponent } from './document-form-dialog/document-form-dialog.component';

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
