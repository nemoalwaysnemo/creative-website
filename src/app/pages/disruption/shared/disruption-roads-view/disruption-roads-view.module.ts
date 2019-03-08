import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { DisruptionRoadsViewComponent } from './disruption-roads-view.component';
import { PaginationModule } from 'app/pages/shared/pagination/pagination.module';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    PaginationModule,
  ],
  declarations: [
    DisruptionRoadsViewComponent,
  ], exports: [
    DisruptionRoadsViewComponent,
  ],
})

export class DisruptionRoadsViewModule {

}
