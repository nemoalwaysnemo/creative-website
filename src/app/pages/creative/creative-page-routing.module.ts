import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreativePageComponent } from './creative-page.component';
import { CreativeHomePageComponent } from './creative-home-page/creative-home-page.component';
import { CreativeAssetPageComponent } from './creative-asset-page/creative-asset-page.component';
import { CreativeBrandAssetComponent } from './creative-brand-page/creative-brand-asset/creative-brand-asset.component';
import { CreativeBrandShowcaseComponent } from './creative-brand-page/creative-brand-showcase/creative-brand-showcase.component';
import { CreativeBrandCampaignComponent } from './creative-brand-page/creative-brand-campaign/creative-brand-campaign.component';
import { CreativeBrandProjectComponent } from './creative-brand-page/creative-brand-project/creative-brand-project.component';
import { CreativeBrandUsageRightsComponent } from './creative-brand-page/creative-brand-usage-rights/creative-brand-usage-rights.component';
import { CreativeBrandManageListComponent } from './creative-brand-page/creative-brand-manage-list/creative-brand-manage-list.component';
import { CreativeBrandManageLibraryComponent } from './creative-brand-page/creative-brand-manage-library/creative-brand-manage-library.component';
import { UserPermission } from '@core/acl';

const routes: Routes = [{
  path: '',
  component: CreativePageComponent,
  children: [
    {
      path: 'home',
      component: CreativeHomePageComponent,
    },
    {
      path: 'asset/:id',
      component: CreativeAssetPageComponent,
    },
    {
      path: 'brand/:id/asset',
      component: CreativeBrandAssetComponent,
    },
    {
      path: 'brand/:id/showcase',
      component: CreativeBrandShowcaseComponent,
    },
    {
      path: 'brand/:id/usageRights',
      component: CreativeBrandUsageRightsComponent,
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: UserPermission.Management,
          redirectTo: 'home',
        },
      },
    },
    {
      path: 'brand/:id/campaign',
      component: CreativeBrandCampaignComponent,
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: UserPermission.Management,
          redirectTo: 'home',
        },
      },
    },
    {
      path: 'brand/:id/project',
      component: CreativeBrandProjectComponent,
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: UserPermission.Management,
          redirectTo: 'home',
        },
      },
    },
    {
      path: 'brand/:id/folder',
      component: CreativeBrandManageListComponent,
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: UserPermission.Management,
          redirectTo: 'home',
        },
      },
    },
    {
      path: 'brand/:id/library',
      component: CreativeBrandManageLibraryComponent,
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: UserPermission.Management,
          redirectTo: 'home',
        },
      },
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
export class CreativePageRoutingModule {
}
