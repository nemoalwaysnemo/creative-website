import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '../../shared';
import { BizDevCaseStudyComponent } from './biz-dev-case-study.component';
import { BizDevFormButtonModule } from '../biz-dev-form-button/biz-dev-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BizDevFormButtonModule,
  ],
  declarations: [
    BizDevCaseStudyComponent,
  ],
})
export class BizDevCaseStudyModule { }
