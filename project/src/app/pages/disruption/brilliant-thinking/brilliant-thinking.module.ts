import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BrilliantThinkingComponent } from './brilliant-thinking.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { DisruptionTabInfoModule } from '../disruption-tab-info/disruption-tab-info.module';
import { DisruptionFormButtonModule } from '../disruption-form-button/disruption-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionTabInfoModule,
    DisruptionFormButtonModule,
  ],
  declarations: [
    BrilliantThinkingComponent,
  ],
})
export class BrilliantThinkingModule { }
