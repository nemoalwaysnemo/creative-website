import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { BrilliantThinkingComponent } from './brilliant-thinking.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    BrilliantThinkingComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class BrilliantThinkingModule { }
