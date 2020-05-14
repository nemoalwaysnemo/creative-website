import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserPermission } from '@core/acl';
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
import { CreativeAgencyBrandComponent } from './creative-agency-page/creative-agency-brand/creative-agency-brand.component';
import { CreativeAgencyShowcaseComponent } from './creative-agency-page/creative-agency-showcase/creative-agency-showcase.component';
import { CreativeAgencyManageLibraryComponent } from './creative-agency-page/creative-agency-manage-library/creative-agency-manage-library.component';
import { CreativeAgencyManageListComponent } from './creative-agency-page/creative-agency-manage-list/creative-agency-manage-list.component';
import { CreativeMyAgencyPageComponent } from './creative-my-agency/creative-my-agency-page.component';


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
          only: UserPermission.Mgt,
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
          only: UserPermission.Mgt,
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
          only: UserPermission.Mgt,
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
          only: UserPermission.Mgt,
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
          only: UserPermission.Mgt,
          redirectTo: 'home',
        },
      },
    },
    {
      path: 'agency',
      component: CreativeMyAgencyPageComponent,
    },
    {
      path: 'agency/:id/brand',
      component: CreativeAgencyBrandComponent,
    },
    {
      path: 'agency/:id/showcase',
      component: CreativeAgencyShowcaseComponent,
    },
    {
      path: 'agency/:id/folder',
      component: CreativeAgencyManageListComponent,
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: UserPermission.Mgt,
          redirectTo: 'home',
        },
      },
    },
    {
      path: 'agency/:id/library',
      component: CreativeAgencyManageLibraryComponent,
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: UserPermission.Mgt,
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
