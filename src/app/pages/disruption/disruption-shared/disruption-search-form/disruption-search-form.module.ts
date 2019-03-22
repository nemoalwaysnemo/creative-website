import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionSearchFormComponent } from './disruption-search-form.component';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    DisruptionSearchFormComponent,
  ], exports: [
    DisruptionSearchFormComponent,
  ],
})

export class DisruptionSearchFormModule {

}
