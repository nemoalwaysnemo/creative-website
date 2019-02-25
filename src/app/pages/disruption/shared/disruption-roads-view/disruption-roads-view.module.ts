import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { DisruptionRoadsViewComponent } from './disruption-roads-view.component';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [
    DisruptionRoadsViewComponent,
  ], exports: [
    DisruptionRoadsViewComponent,
  ],
})

export class DisruptionRoadsViewModule {

}
