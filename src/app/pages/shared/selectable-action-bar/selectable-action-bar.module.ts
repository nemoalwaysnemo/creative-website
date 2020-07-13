
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCheckboxModule } from '@core/nebular/theme';
import { SelectableActionBarComponent } from './selectable-action-bar.component' ;

@NgModule({
  imports: [
    CommonModule,
    NbCheckboxModule,
  ],
  declarations: [
    SelectableActionBarComponent,
  ],
  entryComponents: [
    SelectableActionBarComponent,
  ],
  exports: [
    SelectableActionBarComponent,
  ],
})
export class SelectableActionBarModule { }
