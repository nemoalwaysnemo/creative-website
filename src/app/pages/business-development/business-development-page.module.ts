import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BizDevHomeModule } from './biz-dev-home/biz-dev-home.module';
import { BizDevPageComponent } from './business-development-page.component';
import { BusinessDevelopmentPageRoutingModule } from './business-development-page-routing.module';
import { BizDevCaseStudyModule } from './biz-dev-case-study/biz-dev-case-study.module';
import { BizDevCaseStudyFolderModule } from './biz-dev-case-study-folder/biz-dev-case-study-folder.module';
import { BizDevThoughtLeadershipModule } from './biz-dev-thought-leadership/biz-dev-thought-leadership.module';
import { BizDevThoughtLeadershipFolderModule } from './biz-dev-thought-leadership-folder/biz-dev-thought-leadership-folder.module';

@NgModule({
  imports: [
    ThemeModule,
    BizDevHomeModule,
    BizDevCaseStudyModule,
    BizDevCaseStudyFolderModule,
    BizDevThoughtLeadershipModule,
    BizDevThoughtLeadershipFolderModule,
    BusinessDevelopmentPageRoutingModule,
  ],
  declarations: [
    BizDevPageComponent,
  ],
})
export class BusinessDevelopmentPageModule {
}
