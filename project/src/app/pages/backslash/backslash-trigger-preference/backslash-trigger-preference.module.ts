import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { BackslashTriggerPreferenceComponent } from './backslash-trigger-preference.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BackslashTriggerPreferenceComponent,
  ],
})
export class BackslashTriggerPreferenceModule { }
