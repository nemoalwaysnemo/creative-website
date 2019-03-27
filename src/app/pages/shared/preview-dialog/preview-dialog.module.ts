import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { PreviewDialogComponent } from './preview-dialog.component';
import { NbDialogModule } from '@core/nebular/theme';
import { PreviewDialogService } from './preview-dialog.service';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { DisruptionFormDayModule } from '../disruption-form-day/disruption-form-day.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentViewerModule,
    DisruptionFormDayModule,
    NbDialogModule.forRoot(),
  ],
  declarations: [
    PreviewDialogComponent,
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
