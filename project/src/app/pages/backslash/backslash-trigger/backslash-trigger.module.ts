import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { BackslashTriggerComponent } from './backslash-trigger.component';
import { BackslashTriggerHeaderModule } from '../backslash-trigger-header/backslash-trigger-header.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    BackslashTriggerHeaderModule,
  ],
  declarations: [
    BackslashTriggerComponent,
  ],
})
export class BackslashTriggerModule { }
