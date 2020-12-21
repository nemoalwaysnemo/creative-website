import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { LearningSearchRoutingModule } from './learning-search-routing.module';
import { LearningSearchComponent } from './learning-search.component';
import { GlobalSearchButtonModule } from '../../shared/global-search-button/global-search-button.module';
import { LearningProgramAlumniSearchComponent } from './learning-program-alumni-search/learning-program-alumni-search.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    LearningSearchRoutingModule,
  ],
  declarations: [
    LearningSearchComponent,
    LearningProgramAlumniSearchComponent,
  ],
})
export class LearningSearchModule {
}
