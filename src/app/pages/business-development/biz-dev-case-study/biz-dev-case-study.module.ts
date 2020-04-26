import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '../../shared';
import { BizDevCaseStudyComponent } from './biz-dev-case-study.component';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    BizDevCaseStudyComponent,
  ],
})
export class BizDevCaseStudyModule { }
