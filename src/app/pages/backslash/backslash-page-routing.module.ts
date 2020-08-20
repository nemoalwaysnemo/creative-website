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
import { BackslashEdgeFolderComponent } from './backslash-edge-folder/backslash-edge-folder.component';
import { BackslashAssetViewComponent } from './backslash-asset-view/backslash-asset-view.component';
import { BackslashCaseStudyFolderComponent } from './backslash-case-study-folder/backslash-case-study-folder.component';

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
      path: 'edge/folder/:id',
      component: BackslashEdgeFolderComponent,
    },
    {
      path: 'edge/folder/:folder/asset/:id',
      component: BackslashAssetViewComponent,
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
      path: 'resource/folder/:folder/asset/:id',
      component: BackslashAssetComponent,
    },
    {
      path: 'Case Studies',
      component: BackslashCaseStudyComponent,
    },
    {
      path: 'Case Studies/folder/:id',
      component: BackslashCaseStudyFolderComponent,
    },
    {
      path: 'Case Studies/folder/:folder/asset/:id',
      component: BackslashAssetViewComponent,
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
      path: 'assetview/:id',
      component: BackslashAssetViewComponent,
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
