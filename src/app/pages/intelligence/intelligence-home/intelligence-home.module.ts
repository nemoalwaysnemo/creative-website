import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { IntelligenceHomeComponent } from './intelligence-home.component';
import { RouterModule } from '@angular/router';
import { HomeSearchFormModule, GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFormButtonModule } from '../intelligence-form-button/intelligence-form-button.module';
import { DisruptionFormBrilliantThinkingModule } from '@pages/shared/disruption-form-brilliant-thinking/disruption-form-brilliant-thinking.module';
@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    HomeSearchFormModule,
    PreviewDialogModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFormBrilliantThinkingModule,
    DisruptionFormButtonModule,
  ],
  declarations: [
    IntelligenceHomeComponent,
  ],
})
export class IntelligenceHomeModule { }
