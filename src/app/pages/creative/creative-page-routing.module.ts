import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { AssetComponent } from './asset/asset.component';
import { CreativePageComponent } from './creative-page.component';

const routes: Routes = [{
  path: '',
  component: CreativePageComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent,
    },
    {
      path: 'asset',
      component: AssetComponent,
    }, {
      path: '',
      component: HomeComponent,
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
