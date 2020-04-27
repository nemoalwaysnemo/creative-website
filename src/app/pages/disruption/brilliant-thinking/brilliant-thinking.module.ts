import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BrilliantThinkingComponent } from './brilliant-thinking.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { DisruptionFormButtonModule } from '../disruption-form-button/disruption-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFormButtonModule,
  ],
  declarations: [
    BrilliantThinkingComponent,
  ],
})
export class BrilliantThinkingModule { }
