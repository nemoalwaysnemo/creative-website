
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCheckboxModule } from '@core/nebular/theme';
import { SelectableItemComponent } from './selectable-item.component';
import { SelectableItemDirective } from './selectable-item.directive';

@NgModule({
  imports: [
    CommonModule,
    NbCheckboxModule,
  ],
  declarations: [
    SelectableItemComponent,
    SelectableItemDirective,
  ],
  exports: [
    SelectableItemDirective,
  ],
})
export class SelectableItemModule { }
