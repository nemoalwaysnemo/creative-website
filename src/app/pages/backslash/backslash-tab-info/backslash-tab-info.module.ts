import { NgModule } from '@angular/core';
import { ACLModule } from '@core/acl';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { BackslashTabInfoComponent } from './backslash-tab-info.component';

@NgModule({
  imports: [
    ThemeModule,
    ACLModule,
    CommonModule,
  ],
  declarations: [
    BackslashTabInfoComponent,
  ],
  exports: [
    BackslashTabInfoComponent,
  ],
})
export class BackslashTabInfoModule { }
