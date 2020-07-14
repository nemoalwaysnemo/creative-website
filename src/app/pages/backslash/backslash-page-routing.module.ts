import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BackslashPageComponent } from './backslash-page.component';
import { BackslashHomeComponent } from './backslash-home/backslash-home.component';
import { BackslashAssetComponent } from './backslash-asset/backslash-asset.component';
import { BackslashRemotePageComponent } from './backslash-remote-page.component';

const routes: Routes = [{
  path: '',
  component: BackslashPageComponent,
  children: [
    {
      path: 'home',
      component: BackslashHomeComponent,
    },
    {
      path: 'edges',
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
