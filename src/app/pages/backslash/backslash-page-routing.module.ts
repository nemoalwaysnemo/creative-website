import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BackslashPageComponent } from './backslash-page.component';
import { BackslashRemotePageComponent } from './backslash-remote-page.component';
import { BackslashHomeComponent } from './backslash-home/backslash-home.component';
import { BackslashEdgeComponent } from './backslash-edge/backslash-edge.component';
import { BackslashAssetComponent } from './backslash-asset/backslash-asset.component';
import { BackslashResourceComponent } from './backslash-resource/backslash-resource.component';
import { BackslashCaseStudyComponent } from './backslash-case-study/backslash-case-study.component';
import { BackslashTriggerPoolComponent } from './backslash-trigger-pool/backslash-trigger-pool.component';
import { BackslashResourceFolderComponent } from './backslash-resource-folder/backslash-resource-folder.component';

const routes: Routes = [{
  path: '',
  component: BackslashPageComponent,
  children: [
    {
      path: 'home',
      component: BackslashHomeComponent,
    },
    {
      path: 'edge',
      component: BackslashEdgeComponent,
    },
    {
      path: 'resource',
      component: BackslashResourceComponent,
    },
    {
      path: 'resource/folder/:id',
      component: BackslashResourceFolderComponent,
    },
    {
      path: 'Case Studies',
      component: BackslashCaseStudyComponent,
    },
    {
      path: 'Trigger Pool',
      component: BackslashTriggerPoolComponent,
    },
    {
      path: 'remote',
      component: BackslashRemotePageComponent,
    },
    {
      path: 'asset/:id',
      component: BackslashAssetComponent,
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
export class BackslashPageRoutingModule {
}
