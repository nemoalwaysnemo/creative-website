import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdvanceSearch } from '@core/api';
import { OptionSelectComponent } from './option-select.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
  ],
  exports: [
    OptionSelectComponent,
  ],
  declarations: [
    OptionSelectComponent,
  ],
  providers: [
    AdvanceSearch,
  ],
})
export class OptionSelectModule {

}
