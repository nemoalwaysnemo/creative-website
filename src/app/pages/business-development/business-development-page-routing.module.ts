import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BusinessDevelopmentPageComponent } from './business-development-page.component';
import { BizDevHomeComponent } from './biz-dev-home/biz-dev-home.component';
import { BizDevAssetComponent } from './biz-dev-asset/biz-dev-asset.component';
import { BizDevCaseStudyComponent } from './biz-dev-case-study/biz-dev-case-study.component';
import { BizDevCaseStudyFolderComponent } from './biz-dev-case-study-folder/biz-dev-case-study-folder.component';
import { BizDevThoughtLeadershipComponent } from './biz-dev-thought-leadership/biz-dev-thought-leadership.component';
import { BizDevThoughtLeadershipFolderComponent } from './biz-dev-thought-leadership-folder/biz-dev-thought-leadership-folder.component';

const routes: Routes = [{
  path: '',
  component: BusinessDevelopmentPageComponent,
  children: [
    {
      path: 'home',
      component: BizDevHomeComponent,
    },
    {
      path: 'asset/:id',
      component: BizDevAssetComponent,
    },
    {
      path: 'Case Studies',
      component: BizDevCaseStudyComponent,
    },
    {
      path: 'Case Studies/folder/:id',
      component: BizDevCaseStudyFolderComponent,
    },
    {
      path: 'Thought Leadership',
      component: BizDevThoughtLeadershipComponent,
    },
    {
      path: 'Thought Leadership/folder/:id',
      component: BizDevThoughtLeadershipFolderComponent,
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessDevelopmentPageRoutingModule {
}
