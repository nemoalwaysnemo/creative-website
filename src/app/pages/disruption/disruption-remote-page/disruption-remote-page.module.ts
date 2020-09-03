import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { DisruptionRemotePageComponent } from './disruption-remote-page.component';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
  ],
  declarations: [
    DisruptionRemotePageComponent,
  ],
})
export class DisruptionRemotePageModule {
}
