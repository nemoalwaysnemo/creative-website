import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { BrilliantThinkingComponent } from './brilliant-thinking.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFormBrilliantThinkingDialogComponent } from './disruption-form-brilliant-thinking-body/disruption-form-brilliant-thinking-dialog.component';
import { DisruptionFormBrilliantThinkingModule } from '@pages/shared/disruption-form-brilliant-thinking/disruption-form-brilliant-thinking.module';

@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFormBrilliantThinkingModule,
  ],
  declarations: [
    BrilliantThinkingComponent,
    DisruptionFormBrilliantThinkingDialogComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class BrilliantThinkingModule { }
