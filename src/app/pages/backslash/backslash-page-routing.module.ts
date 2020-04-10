import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BackslashPageComponent } from './backslash-page.component';
import { BackslashHomePageComponent } from './backslash-home-page/backslash-home-page.component';
import { BackslashAssetPageComponent } from './backslash-asset-page/backslash-asset-page.component';

const routes: Routes = [{
  path: '',
  component: BackslashPageComponent,
  children: [
    {
      path: 'home',
      component: BackslashHomePageComponent,
    },
    {
      path: 'asset/:id',
      component: BackslashAssetPageComponent,
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
