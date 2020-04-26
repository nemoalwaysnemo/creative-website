import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentMetadataInfoComponent } from './document-metadata-info.component';
import { DisruptionFormRoadmapModule } from '../disruption-form-roadmap/disruption-form-roadmap.module';
import { DisruptionFormBrilliantThinkingModule } from '../disruption-form-brilliant-thinking/disruption-form-brilliant-thinking.module';
import { DisruptionFormTheoryModule } from '../disruption-form-theory/disruption-form-theory.module';
import { DisruptionFormDayModule } from '../disruption-form-day/disruption-form-day.module';
import { DisruptionFormFolderModule } from '../disruption-form-folder/disruption-form-folder.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DisruptionFormRoadmapModule,
    DisruptionFormBrilliantThinkingModule,
    DisruptionFormTheoryModule,
    DisruptionFormDayModule,
    DisruptionFormFolderModule,
  ],
  declarations: [
    DocumentMetadataInfoComponent,
  ],
  exports: [
    DocumentMetadataInfoComponent,
  ],
})
export class DocumentMetadataInfoModule {
}
