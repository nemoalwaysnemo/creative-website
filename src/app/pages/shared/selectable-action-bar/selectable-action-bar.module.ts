
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbToastrModule, NbCheckboxModule } from '@core/nebular/theme';
import { SelectableActionBarComponent } from './selectable-action-bar.component';

@NgModule({
  imports: [
    CommonModule,
    NbToastrModule,
    NbCheckboxModule,
  ],
  declarations: [
    SelectableActionBarComponent,
  ],
  exports: [
    SelectableActionBarComponent,
  ],
})
export class SelectableActionBarModule { }
