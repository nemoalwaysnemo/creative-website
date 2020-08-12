import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BackslashTriggerPoolComponent } from './backslash-trigger-pool.component';
import { SharedModule } from '@pages/shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BackslashTriggerPoolComponent,
  ],
})
export class BackslashTriggerPoolModule { }
