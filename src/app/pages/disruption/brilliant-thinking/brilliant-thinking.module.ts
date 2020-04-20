import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BrilliantThinkingComponent } from './brilliant-thinking.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFormBrilliantThinkingModule } from '@pages/shared/disruption-form-brilliant-thinking/disruption-form-brilliant-thinking.module';
import { DisruptionFormButtonModule } from '../disruption-form-button/disruption-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFormBrilliantThinkingModule,
    DisruptionFormButtonModule,
  ],
  declarations: [
    BrilliantThinkingComponent,
  ],
})
export class BrilliantThinkingModule { }
