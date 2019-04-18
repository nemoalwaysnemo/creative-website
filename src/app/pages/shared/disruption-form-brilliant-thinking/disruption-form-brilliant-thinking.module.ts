import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisruptionFormBrilliantThinkingComponent } from './disruption-form-brilliant-thinking.component';
import { DocumentFormModule } from '../document-form/document-form.module';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
  ],
  declarations: [
    DisruptionFormBrilliantThinkingComponent,
  ],
  exports: [
    DisruptionFormBrilliantThinkingComponent,
  ],
})
export class DisruptionFormBrilliantThinkingModule { }
