import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from '@core/custom';
import { ListViewComponent } from './list-view.component';
import { SharedDirectiveModule } from '../directives/shared-directive.module';

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    SharedDirectiveModule,
  ],
  declarations: [ListViewComponent],
  exports: [
    ListViewComponent,
  ],
})
export class ListViewModule {

}
