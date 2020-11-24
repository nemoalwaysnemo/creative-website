import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { BackslashTriggerPoolComponent } from './backslash-trigger-pool.component';
import { BackslashFormButtonModule } from '../backslash-form-button/backslash-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BackslashFormButtonModule,
  ],
  declarations: [
    BackslashTriggerPoolComponent,
  ],
})
export class BackslashTriggerPoolModule { }
