import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { DisruptionTheoryRemotePageComponent } from './disruption-theory-remote-page.component';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
  ],
  declarations: [
    DisruptionTheoryRemotePageComponent,
  ],
})
export class DisruptionRemotePageModule {
}
