import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisruptionFormRoadmapComponent } from './disruption-form-roadmap.component';
import { DocumentFormModule } from '../document-form/document-form.module';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
  ],
  declarations: [
    DisruptionFormRoadmapComponent,
  ],
  exports: [
    DisruptionFormRoadmapComponent,
  ],
})
export class DisruptionFormRoadmapModule { }
