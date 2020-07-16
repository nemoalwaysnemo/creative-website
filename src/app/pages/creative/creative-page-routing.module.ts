import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserPermission } from '@core/acl';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreativePageComponent } from './creative-page.component';
import { CreativeHomeComponent } from './creative-home/creative-home.component';
import { CreativeAssetComponent } from './creative-asset/creative-asset.component';
import { CreativeMyAgencyComponent } from './creative-my-agency/creative-my-agency.component';
import { CreativeBrandAssetComponent } from './creative-brand/creative-brand-asset/creative-brand-asset.component';
import { CreativeBrandShowcaseComponent } from './creative-brand/creative-brand-showcase/creative-brand-showcase.component';
import { CreativeBrandCampaignComponent } from './creative-brand/creative-brand-campaign/creative-brand-campaign.component';
import { CreativeBrandProjectComponent } from './creative-brand/creative-brand-project/creative-brand-project.component';
import { CreativeBrandUsageRightsComponent } from './creative-brand/creative-brand-usage-rights/creative-brand-usage-rights.component';
import { CreativeBrandManageListComponent } from './creative-brand/creative-brand-manage-list/creative-brand-manage-list.component';
import { CreativeBrandManageLibraryComponent } from './creative-brand/creative-brand-manage-library/creative-brand-manage-library.component';
import { CreativeAgencyBrandComponent } from './creative-agency/creative-agency-brand/creative-agency-brand.component';
import { CreativeAgencyShowcaseComponent } from './creative-agency/creative-agency-showcase/creative-agency-showcase.component';
import { CreativeAgencyManageLibraryComponent } from './creative-agency/creative-agency-manage-library/creative-agency-manage-library.component';
import { CreativeBrandCampaignSummaryComponent } from './creative-brand/creative-brand-campaign-summary/creative-brand-campaign-summary.component';
import { CreativeAgencyManageListComponent } from './creative-agency/creative-agency-manage-list/creative-agency-manage-list.component';


const routes: Routes = [{
  path: '',
  component: CreativePageComponent,
  children: [
    {
      path: 'home',
      component: CreativeHomeComponent,
    },
    {
      path: 'asset/:id',
      component: CreativeAssetComponent,
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
      path: 'brand/:id/usage rights',
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
      path: 'brand/:id/campaign summary',
      component: CreativeBrandCampaignSummaryComponent,
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
      path: 'brand/:id/list',
      component: CreativeBrandManageListComponent,
    },
    {
      path: 'agency',
      component: CreativeMyAgencyComponent,
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
      path: 'agency/:id/list',
      component: CreativeAgencyManageListComponent,
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
