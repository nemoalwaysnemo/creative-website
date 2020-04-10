import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BackslashPageComponent } from './backslash-page.component';
import { BackslashHomePageComponent } from './backslash-home-page/backslash-home-page.component';
import { BackslashAssetPageComponent } from './backslash-asset-page/backslash-asset-page.component';
import { BackslashRemotePageComponent } from './backslash-remote-page.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UserPermission } from '@core/acl';

const routes: Routes = [{
  path: '',
  component: BackslashPageComponent,
  children: [
    {
      path: 'home',
      component: BackslashHomePageComponent,
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: UserPermission.Mgt,
          redirectTo: 'edges',
        },
      },
    },
    {
      path: 'edges',
      component: BackslashRemotePageComponent,
    },
    {
      path: 'asset/:id',
      component: BackslashAssetPageComponent,
    },
    {
      path: '',
      redirectTo: 'edges',
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
