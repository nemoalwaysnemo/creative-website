import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NbDatepickerModule } from '@core/nebular/theme';
import { DatepickerDirectiveComponent } from './datepicker-directive.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NbDatepickerModule,
  ],
  exports: [
    DatepickerDirectiveComponent,
  ],
  declarations: [
    DatepickerDirectiveComponent,
  ],
})
export class DatepickerDirectiveModule {

}
