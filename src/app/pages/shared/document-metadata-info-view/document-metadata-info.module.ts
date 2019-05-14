import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentMetadataInfoComponent } from './document-metadata-info.component';
import { PreviewDialogModule } from '../preview-dialog/preview-dialog.module';
import { DisruptionFormRoadmapModule } from '../disruption-form-roadmap/disruption-form-roadmap.module';
import { DisruptionFormBrilliantThinkingModule } from '../disruption-form-brilliant-thinking/disruption-form-brilliant-thinking.module';
import { MetadataEditFormDialogComponent } from './metadata-dialog-body/metadata-edit-form-dialog.component';
import { DisruptionFormTheoryModule } from '../disruption-form-theory/disruption-form-theory.module';
import { DisruptionFormDayModule } from '../disruption-form-day/disruption-form-day.module';
import { DisruptionFormFoldersModule } from '../disruption-form-folders/disruption-form-folders.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    PreviewDialogModule,
    DisruptionFormRoadmapModule,
    DisruptionFormBrilliantThinkingModule,
    DisruptionFormTheoryModule,
    DisruptionFormDayModule,
    DisruptionFormFoldersModule,
  ],
  declarations: [
    DocumentMetadataInfoComponent,
    MetadataEditFormDialogComponent,
  ],
  exports: [
    DocumentMetadataInfoComponent,
  ],
})
export class DocumentMetadataInfoModule {
}
