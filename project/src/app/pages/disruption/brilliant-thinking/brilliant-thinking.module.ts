import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BrilliantThinkingComponent } from './brilliant-thinking.component';
import { DocumentRouteTabsetModule, GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { DisruptionFormButtonModule } from '../disruption-form-button/disruption-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFormButtonModule,
    DocumentRouteTabsetModule,
  ],
  declarations: [
    BrilliantThinkingComponent,
  ],
})
export class BrilliantThinkingModule { }
