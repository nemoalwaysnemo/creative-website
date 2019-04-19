import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { PreviewDialogComponent } from './preview-dialog.component';
import { NbDialogModule } from '@core/nebular/theme';
import { PreviewDialogService } from './preview-dialog.service';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { DisruptionFormDayModule } from '../disruption-form-day/disruption-form-day.module';
import { DisruptionAssetPreviewDialogBodyComponent } from './preview-dialog-body/disruption-asset-preview-dialog-body/disruption-asset-preview-dialog-body.component';

const COMPONENTS = [
  PreviewDialogComponent,
  DisruptionAssetPreviewDialogBodyComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentViewerModule,
    DisruptionFormDayModule,
    NbDialogModule.forRoot(),
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class PreviewDialogModule {

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: PreviewDialogModule,
      providers: [
        PreviewDialogService,
        ...NbDialogModule.forRoot().providers,
      ],
    };
  }
}
