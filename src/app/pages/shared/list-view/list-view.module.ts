import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from '@core/custom';
import { ListViewComponent } from './list-view.component';
import { SharedDirectiveModule } from '../directives/shared-directive.module';
import { ThemeModule } from '@theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    SharedDirectiveModule,
    ThemeModule,
  ],
  declarations: [ListViewComponent],
  exports: [
    ListViewComponent,
  ],
})
export class ListViewModule {

}
