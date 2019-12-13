import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreativeHomePageComponent } from './creative-home-page/creative-home-page.component';
import { CreativeAssetPageComponent } from './creative-asset-page/creative-asset-page.component';
import { CreativePageComponent } from './creative-page.component';

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
      path: 'brand',
      loadChildren: () => import('./creative-brand-page/creative-brand-page.module').then(m => m.CreativeBrandPageModule),
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
