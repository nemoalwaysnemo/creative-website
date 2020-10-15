import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { BackslashRemotePageComponent } from './backslash-remote-page.component';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
  ],
  declarations: [
    BackslashRemotePageComponent,
  ],
})
export class BackslashRemotePageModule {
}
