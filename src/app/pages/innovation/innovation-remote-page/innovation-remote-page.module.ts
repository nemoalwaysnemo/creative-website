import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { InnovationRemotePageComponent } from './innovation-remote-page.component';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
  ],
  declarations: [
    InnovationRemotePageComponent,
  ],
})
export class InnovationRemotePageModule {
}
