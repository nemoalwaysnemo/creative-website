import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisruptionFormTheoryComponent } from './disruption-form-theory.component';
import { DocumentFormModule } from '../document-form/document-form.module';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
  ],
  declarations: [
    DisruptionFormTheoryComponent,
  ],
  exports: [
    DisruptionFormTheoryComponent,
  ],
})
export class DisruptionFormTheoryModule { }
