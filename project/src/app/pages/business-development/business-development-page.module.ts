import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BizDevHomeModule } from './biz-dev-home/biz-dev-home.module';
import { BusinessDevelopmentPageComponent } from './business-development-page.component';
import { BusinessDevelopmentPageRoutingModule } from './business-development-page-routing.module';
import { BizDevOpportunityModule } from './biz-dev-opportunity/biz-dev-opportunity.module';
import { BizDevOpportunityFolderModule } from './biz-dev-opportunity-folder/biz-dev-opportunity-folder.module';
import { BizDevCaseStudyModule } from './biz-dev-case-study/biz-dev-case-study.module';
import { BizDevCaseStudyFolderModule } from './biz-dev-case-study-folder/biz-dev-case-study-folder.module';
import { BizDevThoughtLeadershipModule } from './biz-dev-thought-leadership/biz-dev-thought-leadership.module';
import { BizDevThoughtLeadershipFolderModule } from './biz-dev-thought-leadership-folder/biz-dev-thought-leadership-folder.module';
import { BizDevAssetModule } from './biz-dev-asset/biz-dev-asset.module';
import { BizDevRemotePageModule } from './biz-dev-remote-page/biz-dev-remote-page.module';

@NgModule({
  imports: [
    ThemeModule,
    BizDevHomeModule,
    BizDevAssetModule,
    BizDevOpportunityModule,
    BizDevOpportunityFolderModule,
    BizDevCaseStudyModule,
    BizDevCaseStudyFolderModule,
    BizDevThoughtLeadershipModule,
    BizDevThoughtLeadershipFolderModule,
    BusinessDevelopmentPageRoutingModule,
    BizDevRemotePageModule,
  ],
  declarations: [
    BusinessDevelopmentPageComponent,
  ],
})
export class BusinessDevelopmentPageModule {
}
