import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { BackslashTriggerHeaderComponent } from './backslash-trigger-header.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BackslashTriggerHeaderComponent,
  ],
  exports: [
    BackslashTriggerHeaderComponent,
  ],
})
export class BackslashTriggerHeaderModule { }
