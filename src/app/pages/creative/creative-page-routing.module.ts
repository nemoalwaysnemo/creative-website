import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { AssetComponent } from './asset/asset.component';
import { CreativePageComponent } from './creative-page.component';
import { BrandComponent } from './brand/brand.component';

const routes: Routes = [{
  path: '',
  component: CreativePageComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent,
    },
    {
      path: 'search',
      component: SearchComponent,
    }, {
      path: 'document',
      component: AssetComponent,
    }, {
      path: 'brand',
      component: BrandComponent,
    },
    {
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
