import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { NbDialogModule } from '@core/nebular/theme';
import { DocumentViewerModule } from '../../document-viewer/document-viewer.module';
import { BackslashHomeAssetDialogPreviewComponent } from './backslash-home-asset-preview/backslash-home-asset-preview.component';
import { DocumentBackslashInfoModule } from '../../../shared/document-backslash-info/document-backslash-info.module';

const COMPONENTS = [
  BackslashHomeAssetDialogPreviewComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentViewerModule,
    DocumentBackslashInfoModule,
    NbDialogModule.forChild(),
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class GlobalDocumentDialogTemplateModule {

}
