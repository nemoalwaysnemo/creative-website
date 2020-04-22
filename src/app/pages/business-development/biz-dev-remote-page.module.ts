import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { BizDevRemotePageComponent } from './biz-dev-remote-page.component';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
  ],
  declarations: [
    BizDevRemotePageComponent,
  ],
})
export class BizDevRemotePageModule {
}
