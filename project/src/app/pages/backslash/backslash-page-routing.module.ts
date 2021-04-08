import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserPermission } from '@core/acl';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { BackslashPageComponent } from './backslash-page.component';
import { BackslashRemotePageComponent } from './backslash-remote-page/backslash-remote-page.component';
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
import { BackslashTriggerPoolViewComponent } from './backslash-trigger-pool-view/backslash-trigger-pool-view.component';
import { BackslashCategoryComponent } from './backslash-category/backslash-category.component';
import { BackslashRegionComponent } from './backslash-region/backslash-region.component';
import { BackslashTriggerComponent } from './backslash-trigger/backslash-trigger.component';
import { BackslashTriggerPreferenceComponent } from './backslash-trigger-preference/backslash-trigger-preference.component';

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
      component: BackslashAssetViewComponent,
    },
    {
      path: 'report',
      component: BackslashCaseStudyComponent,
    },
    {
      path: 'category',
      component: BackslashCategoryComponent,
    },
    {
      path: 'region',
      component: BackslashRegionComponent,
    },
    {
      path: 'report/folder/:id',
      component: BackslashCaseStudyFolderComponent,
    },
    {
      path: 'report/folder/:folder/asset/:id',
      component: BackslashAssetViewComponent,
    },
    {
      path: 'trigger',
      component: BackslashTriggerComponent,
    },
    {
      path: 'trigger/preference',
      component: BackslashTriggerPreferenceComponent,
    },
    {
      path: 'Trigger Pool',
      component: BackslashTriggerPoolComponent,
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: UserPermission.Mgt,
          redirectTo: 'home',
        },
      },
    },
    {
      path: 'Trigger Pool/asset/:id',
      component: BackslashTriggerPoolViewComponent,
    },
    {
      path: 'remote/:id',
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
