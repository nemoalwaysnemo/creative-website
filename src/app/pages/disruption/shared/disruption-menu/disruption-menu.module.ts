import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DisruptionMenuComponent } from './disruption-menu.component';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    DisruptionMenuComponent,
  ], exports: [
    DisruptionMenuComponent,
  ],
})

export class DisruptionMenuModule {

}
