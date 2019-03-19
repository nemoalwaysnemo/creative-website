import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisruptionFormDayComponent } from './disruption-form-day.component';
import { DocumentFormModule } from '../document-form/document-form.module';

@NgModule({
  imports: [
    CommonModule,
    DocumentFormModule,
  ],
  declarations: [
    DisruptionFormDayComponent,
  ],
  exports: [
    DisruptionFormDayComponent,
  ],
})
export class DisruptionFormDayModule { }
