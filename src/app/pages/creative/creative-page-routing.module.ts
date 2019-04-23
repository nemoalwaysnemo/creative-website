import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreativeHomeComponent } from './creative-home/creative-home.component';
import { CreativeAssetComponent } from './creative-asset/creative-asset.component';
import { CreativePageComponent } from './creative-page.component';

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
    }, {
      path: '',
      component: CreativeHomeComponent,
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
