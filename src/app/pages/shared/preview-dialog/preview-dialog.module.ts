import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { PreviewDialogComponent } from './preview-dialog.component';
import { NbDialogModule } from '@core/nebular/theme';
import { PreviewDialogService } from './preview-dialog.service';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { DisruptionFormDayModule } from '../disruption-form-day/disruption-form-day.module';
import { DisruptionAssetPreviewDialogBodyComponent } from './preview-dialog-body/disruption-asset-preview-dialog-body/disruption-asset-preview-dialog-body.component';
import { BackslashAssetPreviewDialogBodyComponent } from './preview-dialog-body/backslash-asset-preview-dialog-body/backslash-asset-preview-dialog-body.component';
import { BackslashHomeAssetPreviewDialogBodyComponent} from './preview-dialog-body/backslash-home-asset-preview-dialog-body/backslash-home-asset-preview-dialog-body.component';
import { PreviewDialogAlertComponent } from './preview-dialog-alert/preview-dialog-alert.component';
import { DeleteDialogBodyComponent } from './delete-dialog-body/delete-dialog-body.component';
import { ShareDocumentButtonModule } from '../share-document-button/share-document-button.module';
import { DocumentBackslashInfoModule } from '../document-backslash-info/document-backslash-info.module';

const COMPONENTS = [
  PreviewDialogComponent,
  PreviewDialogAlertComponent,
  BackslashAssetPreviewDialogBodyComponent,
  BackslashHomeAssetPreviewDialogBodyComponent,
  DisruptionAssetPreviewDialogBodyComponent,
  DeleteDialogBodyComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentViewerModule,
    DisruptionFormDayModule,
    ShareDocumentButtonModule,
    DocumentBackslashInfoModule,
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
