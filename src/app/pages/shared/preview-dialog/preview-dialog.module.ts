import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { PreviewDialogComponent } from './preview-dialog.component';
import { NbDialogModule } from '@core/nebular/theme';
import { PreviewDialogService } from './preview-dialog.service';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { BackslashDialogComponent } from './backslash-body/backslash-dialog.component';
import { DisruptionDialogComponent } from './disruption-body/disruption-dialog.component';
import { IntelligenceDialogComponent } from '@pages/shared/preview-dialog/intelligence-body/intelligence-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentViewerModule,
    NbDialogModule.forRoot(),
  ],
  declarations: [
    PreviewDialogComponent,
    BackslashDialogComponent,
    DisruptionDialogComponent,
    IntelligenceDialogComponent,
  ],
  exports: [
    PreviewDialogComponent,
  ],
})
export class PreviewDialogModule {

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: PreviewDialogModule,
      providers: [
        PreviewDialogService,
      ],
    };
  }
}
