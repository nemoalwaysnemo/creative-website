import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { BrilliantThinkingComponent } from './brilliant-thinking.component';
import { DisruptionRoadsViewModule } from '../../shared/disruption-roads-view/disruption-roads-view.module';
import { DisruptionSearchFormModule } from '../../shared/disruption-search-form/disruption-search-form.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionRoadsViewModule,
    DisruptionSearchFormModule,
  ],
  declarations: [
    BrilliantThinkingComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class BrilliantThinkingModule { }
