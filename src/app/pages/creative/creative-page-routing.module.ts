import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
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
      component: ListComponent,
    }, {
      path: 'document',
      component: DetailComponent,
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
